import { sleep } from ".";
import { SearchOptions, Album, MediaType, Playlist, Track } from "./medias";
import { asyncJsonp } from "./jsonp";

// ------------------------------------------------------------------

const RATE_LIMIT_DELAY = 5000; // ms

// ------------------------------------------------------------------

export type ApiError = {
	code: number;
	message: string;
	type: string;
};

export type ApiAlbum = {
	error?: ApiError;
	artist: {
		id: number;
		name: string;
		picture_big: string;
		picture_small: string;
	};
	cover_big: string;
	cover_small: string;
	id: number;
	title: string;
	tracks?: { data: ApiTrack[] };
};

export type ApiPlaylist = {
	error?: ApiError;
	creator?: {
		id: number;
		name: string;
	};
	id: number;
	picture_big: string;
	picture_small: string;
	public: true;
	title: string;
	tracks?: { data: ApiTrack[] };
	user?: {
		id: number;
		name: string;
	};
};

export type ApiTrack = {
	error?: ApiError;
	album: {
		cover_big: string;
		cover_small: string;
		id: number;
		title: string;
	};
	artist: {
		id: number;
		name: string;
		picture_big: string;
		picture_small: string;
	};
	duration: number;
	id: number;
	preview: string;
	readable: boolean;
	title: string;
};

export type ApiSearchResult<T> = {
	data: T[];
	total: number;
};

// ------------------------------------------------------------------

const ConvertAlbum = (album: ApiAlbum): Album => ({
	artist: {
		id: album.artist.id.toString(),
		name: album.artist.name,
		link: `https://www.deezer.com/artist/${album.artist.id}`,
		picture_big: album.artist.picture_big,
		picture_small: album.artist.picture_small
	},
	cover_big: album.cover_big,
	cover_small: album.cover_small,
	id: album.id.toString(),
	link: `https://www.deezer.com/album/${album.id}`,
	provider: "deezer",
	title: album.title,
	tracks:
		album.tracks !== void 0
			? album.tracks.data
					.filter(track => track.readable && track.preview)
					.map(track => ConvertTrack(track, album))
			: void 0,
	type: "album"
});

const ConvertPlaylist = (
	playlist: ApiPlaylist,
	user: { id: number; name: string }
): Playlist => ({
	id: playlist.id.toString(),
	link: `https://www.deezer.com/playlist/${playlist.id}`,
	picture_big: playlist.picture_big,
	picture_small: playlist.picture_small,
	provider: "deezer",
	title: playlist.title,
	tracks:
		playlist.tracks !== void 0
			? playlist.tracks.data
					.filter(track => track.readable && track.preview)
					.map(track => ConvertTrack(track, track.album))
			: void 0,
	type: "playlist",
	user: {
		id: user.id.toString(),
		name: user.name,
		link: `https://www.deezer.com/profile/${user.id}`
	}
});

const ConvertTrack = (
	track: ApiTrack,
	album: { id: number; title: string; cover_big: string; cover_small: string }
): Track => ({
	album: {
		id: album.id.toString(),
		link: `https://www.deezer.com/album/${album.id}`,
		title: album.title,
		cover_big: album.cover_big,
		cover_small: album.cover_small
	},
	artist: {
		id: track.artist.id.toString(),
		name: track.artist.name,
		link: `https://www.deezer.com/artist/${track.artist.id}`,
		picture_big: track.artist.picture_big,
		picture_small: track.artist.picture_small
	},
	duration: track.duration,
	id: track.id.toString(),
	link: `https://www.deezer.com/track/${track.id}`,
	preview: track.preview,
	provider: "deezer",
	title: track.title,
	type: "track"
});

// ------------------------------------------------------------------

export type DeezerApi = {
	searchAlbums: (query: string, options?: SearchOptions) => Promise<Album[]>;

	searchPlaylists: (
		query: string,
		options?: SearchOptions
	) => Promise<Playlist[]>;

	searchTracks: (query: string, options?: SearchOptions) => Promise<Track[]>;

	loadAlbums: (ids: string[]) => Promise<Album[]>;

	loadPlaylists: (ids: string[]) => Promise<Playlist[]>;

	loadTracks: (ids: string[]) => Promise<Track[]>;
};

// ------------------------------------------------------------------

const DeezerApiImpl = (): DeezerApi => {
	const API_BASE = "https://api.deezer.com";

	const _call = async <T>(path: string, qs?: string): Promise<T> => {
		// We have to rely on jsonp because the Deezer api is CORS restricted
		console.debug("[Deezer] Requesting... ", { path, qs });
		return asyncJsonp(`${API_BASE}/${path}`, qs);
	};

	const _search = <T>(
		type: MediaType,
		query: string,
		options?: SearchOptions
	) =>
		_call<ApiSearchResult<T>>(
			`search/${type}`,
			`q=${encodeURIComponent(query)}${
				options && options.limit ? `&limit=${options.limit}` : ""
			}`
		);

	const _load = <T extends { error?: ApiError }>(
		type: MediaType,
		ids: string[]
	) =>
		Promise.all(
			ids.map(async id => {
				const media = await _call<T>(`${type}/${id}`);
				if (media.error) {
					if (media.error.code === 4) {
						// Quota limit exceeded
						return null;
					}
					console.error(
						"[Deezer] An error occured while loading media",
						media.error
					);
					throw new Error("An error occured while loading media");
				}
				return media;
			})
		);

	const _loadWithRetry = async <T extends { error?: ApiError }>(
		type: MediaType,
		ids: string[]
	) => {
		let first = true;
		const medias: Array<T | null> = ids.map(() => null);
		while (medias.includes(null)) {
			const subIds: string[] = [];
			const subIndexes: number[] = [];
			medias.forEach((media, index) => {
				if (!media) {
					subIds.push(ids[index]);
					subIndexes.push(index);
				}
			});
			if (!first) {
				console.debug(`[Deezer] Handling rate limit delayed batch...`, {
					subIds
				});
				await sleep(RATE_LIMIT_DELAY);
			}
			const subMedias = await _load<T>(type, subIds);
			subIndexes.forEach((index, subIndex) => {
				medias[index] = subMedias[subIndex];
			});
			first = false;
		}
		return medias as T[];
	};

	const searchAlbums = async (
		query: string,
		options?: SearchOptions
	): Promise<Album[]> => {
		if (query.trim().length === 0) {
			return [];
		}
		return (await _search<ApiAlbum>("album", query, options)).data.map(
			ConvertAlbum
		);
	};

	const searchPlaylists = async (
		query: string,
		options?: SearchOptions
	): Promise<Playlist[]> => {
		if (query.trim().length === 0) {
			return [];
		}
		return (await _search<ApiPlaylist>("playlist", query, options)).data
			.filter(playlist => playlist.public)
			.map(playlist => ConvertPlaylist(playlist, playlist.user!));
	};

	const searchTracks = async (
		query: string,
		options?: SearchOptions
	): Promise<Track[]> => {
		if (query.trim().length === 0) {
			return [];
		}
		return (await _search<ApiTrack>("track", query, options)).data
			.filter(track => track.readable && track.preview)
			.map(track => ConvertTrack(track, track.album));
	};

	const loadAlbums = async (ids: string[]): Promise<Album[]> => {
		if (ids.length === 0) {
			return [];
		}
		console.debug("[Deezer] Loading albums...", { ids });
		const albums = await _loadWithRetry<ApiAlbum>("album", ids);
		return albums.map(album => ConvertAlbum(album));
	};

	const loadPlaylists = async (ids: string[]): Promise<Playlist[]> => {
		if (ids.length === 0) {
			return [];
		}
		console.debug("[Deezer] Loading playlists...", { ids });
		const playlists = await _loadWithRetry<ApiPlaylist>("playlist", ids);
		return playlists.map(playlist =>
			ConvertPlaylist(playlist, playlist.creator!)
		);
	};

	const loadTracks = async (ids: string[]): Promise<Track[]> => {
		if (ids.length === 0) {
			return [];
		}
		console.debug("[Deezer] Loading tracks...", { ids });
		const tracks = await _loadWithRetry<ApiTrack>("track", ids);
		return tracks.map(track => ConvertTrack(track, track.album));
	};

	return {
		searchAlbums,
		searchPlaylists,
		searchTracks,
		loadAlbums,
		loadPlaylists,
		loadTracks
	};
};

// ------------------------------------------------------------------

export const DEFAULT_API = DeezerApiImpl();
