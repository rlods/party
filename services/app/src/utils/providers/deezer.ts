import { sleep } from "../";
import { Album, MediaType, Playlist, Track } from "../medias";
import { SearchOptions, ProviderApi } from "../providers";
import { callProxy } from "../proxy";

// ------------------------------------------------------------------

const WWW_BASE = "https://www.deezer.com";
const RATE_LIMIT_DELAY = 5000; // ms

// ------------------------------------------------------------------

export type DeezerApiError = {
	code: number;
	message: string;
	type: string;
};

export type DeezerApiDataCollection<T> = {
	data: T[];
};

export type DeezerApiSearchResult<T> = {
	data: T[];
	total: number;
};

// ------------------------------------------------------------------

export type DeezerApiArtist = {
	id: number;
	name: string;
};

export type DeezerApiUser = {
	id: number;
	name: string;
};

// ------------------------------------------------------------------

export type DeezerApiAlbum = {
	error?: DeezerApiError;
	artist: DeezerApiArtist;
	cover_big: string;
	cover_small: string;
	id: number;
	title: string;
	tracks?: DeezerApiDataCollection<DeezerApiTrack>;
};

export type DeezerApiAlbumLight = {
	cover_big: string;
	cover_small: string;
	id: number;
	title: string;
};

export type DeezerApiPlaylist = {
	error?: DeezerApiError;
	creator?: DeezerApiUser;
	id: number;
	picture_big: string;
	picture_small: string;
	public: boolean;
	title: string;
	tracks?: DeezerApiDataCollection<DeezerApiTrack>;
	user?: DeezerApiUser;
};

export type DeezerApiTrack = {
	error?: DeezerApiError;
	album?: DeezerApiAlbumLight;
	artist: DeezerApiArtist;
	id: number;
	preview: string;
	readable: boolean;
	title: string;
};

// ------------------------------------------------------------------

const ConvertAlbum = (album: DeezerApiAlbum): Album => ({
	artist: {
		id: album.artist.id.toString(),
		name: album.artist.name,
		link: `${WWW_BASE}/artist/${album.artist.id}`
	},
	id: album.id.toString(),
	link: `${WWW_BASE}/album/${album.id}`,
	name: album.title,
	picture_big: album.cover_big,
	picture_small: album.cover_small,
	provider: "deezer",
	tracks:
		album.tracks !== void 0
			? album.tracks.data
					.filter(track => track.readable && track.preview)
					.map(track => ConvertTrack(track, album))
			: [],
	type: "album"
});

const ConvertPlaylist = (
	playlist: DeezerApiPlaylist,
	user: DeezerApiUser
): Playlist => ({
	id: playlist.id.toString(),
	link: `${WWW_BASE}/playlist/${playlist.id}`,
	name: playlist.title,
	picture_big: playlist.picture_big,
	picture_small: playlist.picture_small,
	provider: "deezer",
	tracks:
		playlist.tracks !== void 0
			? playlist.tracks.data
					.filter(track => track.readable && track.preview)
					.map(track => ConvertTrack(track, track.album!))
			: [],
	type: "playlist",
	user: {
		id: user.id.toString(),
		link: `${WWW_BASE}/profile/${user.id}`,
		name: user.name
	}
});

const ConvertTrack = (
	track: DeezerApiTrack,
	album: DeezerApiAlbumLight
): Track => ({
	album: {
		id: album.id.toString(),
		link: `${WWW_BASE}/album/${album.id}`,
		name: album.title,
		picture_big: album.cover_big,
		picture_small: album.cover_small
	},
	artist: {
		id: track.artist.id.toString(),
		link: `${WWW_BASE}/artist/${track.artist.id}`,
		name: track.artist.name
	},
	id: track.id.toString(),
	link: `${WWW_BASE}/track/${track.id}`,
	name: track.title,
	preview: track.preview,
	provider: "deezer",
	type: "track"
});

// ------------------------------------------------------------------

const DeezerApiImpl = (): ProviderApi => {
	const _call = <T>(
		path: string,
		params: { [key: string]: string }
	): Promise<T> => callProxy(`/deezer/${path}`, params);

	const _search = <T>(
		type: MediaType,
		query: string,
		options: SearchOptions
	) =>
		_call<DeezerApiSearchResult<T>>("search", {
			limit: options.limit.toString(),
			offset: options.offset.toString(),
			q: encodeURIComponent(query),
			type: type
		});

	const _load = async <T extends { error?: DeezerApiError }>(
		type: MediaType,
		ids: ReadonlyArray<string>
	): Promise<{
		delayedIds: string[];
		failedIds: string[];
		loadedMedias: T[];
	}> => {
		const delayedIds: string[] = [];
		const failedIds: string[] = [];
		const loadedMedias: T[] = [];
		await Promise.all(
			ids.map(async id => {
				const media = await _call<T>("load", { id, type });
				if (!media.error) {
					console.log("[Deezer] Loaded media", { type, id, media });
					loadedMedias.push(media);
					return;
				}
				if (media.error.code === 4) {
					delayedIds.push(id);
					return; // Quota limit exceeded, do not throw so that it will be retried later
				}
				console.error(
					`[Deezer] An error occured while loading ${type}:`,
					media.error
				);
				failedIds.push(id);
			})
		);
		return { delayedIds, failedIds, loadedMedias };
	};

	const _loadWithRetry = async <T extends { error?: DeezerApiError }>(
		type: MediaType,
		ids: ReadonlyArray<string>
	): Promise<T[]> => {
		let first = true;
		const res: T[] = [];
		let remainingIds = [...ids];
		while (remainingIds.length > 0) {
			if (!first) {
				console.debug(`[Deezer] Handling rate limit delayed batch...`, {
					remainingIds
				});
				await sleep(RATE_LIMIT_DELAY);
			}
			const { delayedIds, loadedMedias } = await _load<T>(
				type,
				remainingIds
			);
			res.push(...loadedMedias);
			remainingIds = delayedIds;
			first = false;
		}
		return res;
	};

	const searchAlbums = async (
		query: string,
		options: SearchOptions
	): Promise<Album[]> => {
		if (query.trim().length === 0) {
			return [];
		}
		return (
			await _search<DeezerApiAlbum>("album", query, options)
		).data.map(ConvertAlbum);
	};

	const searchPlaylists = async (
		query: string,
		options: SearchOptions
	): Promise<Playlist[]> => {
		if (query.trim().length === 0) {
			return [];
		}
		return (
			await _search<DeezerApiPlaylist>("playlist", query, options)
		).data
			.filter(playlist => playlist.public)
			.map(playlist => ConvertPlaylist(playlist, playlist.user!));
	};

	const searchTracks = async (
		query: string,
		options: SearchOptions
	): Promise<Track[]> => {
		if (query.trim().length === 0) {
			return [];
		}
		return (await _search<DeezerApiTrack>("track", query, options)).data
			.filter(track => track.readable && track.preview)
			.map(track => ConvertTrack(track, track.album!));
	};

	const loadAlbums = async (ids: ReadonlyArray<string>): Promise<Album[]> => {
		if (ids.length === 0) {
			return [];
		}
		console.debug("[Deezer] Loading albums...", { ids });
		const albums = await _loadWithRetry<DeezerApiAlbum>("album", ids);
		return albums.map(ConvertAlbum);
	};

	const loadPlaylists = async (
		ids: ReadonlyArray<string>
	): Promise<Playlist[]> => {
		if (ids.length === 0) {
			return [];
		}
		console.debug("[Deezer] Loading playlists...", { ids });
		const playlists = await _loadWithRetry<DeezerApiPlaylist>(
			"playlist",
			ids
		);
		return playlists.map(playlist =>
			ConvertPlaylist(playlist, playlist.creator!)
		);
	};

	const loadTracks = async (ids: ReadonlyArray<string>): Promise<Track[]> => {
		if (ids.length === 0) {
			return [];
		}
		console.debug("[Deezer] Loading tracks...", { ids });
		const tracks = await _loadWithRetry<DeezerApiTrack>("track", ids);
		return tracks.map(track => ConvertTrack(track, track.album!));
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

let DEFAULT_IMPL: ProviderApi | null = null;

export const getDeezerApi = (): ProviderApi => {
	if (!DEFAULT_IMPL) {
		DEFAULT_IMPL = DeezerApiImpl();
	}
	return DEFAULT_IMPL;
};
