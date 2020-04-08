// import Axios from "axios";
import jsonp from "jsonp";
//
import { sleep } from ".";
import {
	SearchResults,
	Container,
	ContainerType,
	Album,
	Playlist,
	Track,
	MediaType
} from "./medias";

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
	title: track.title,
	type: "track"
});

// ------------------------------------------------------------------

export type DeezerApi = {
	searchAlbums: (query: string) => Promise<Album[]>;

	searchPlaylists: (query: string) => Promise<Playlist[]>;

	searchTracks: (query: string) => Promise<Track[]>;

	search: (query: string) => Promise<SearchResults>;

	loadAlbums: (ids: string[]) => Promise<Album[]>;

	loadPlaylists: (ids: string[]) => Promise<Playlist[]>;

	loadContainers: (
		type: ContainerType,
		ids: string[]
	) => Promise<Container[]>;

	loadTracks: (ids: string[]) => Promise<Track[]>;
};

// ------------------------------------------------------------------

const DeezerApiImpl = (): DeezerApi => {
	const API_BASE = "https://api.deezer.com";

	const _asyncJsonp = <T>(url: string): Promise<T> =>
		new Promise((resolve, reject) => {
			jsonp(url, void 0, (err, data) => {
				if (err) {
					reject(new Error(err.message));
				} else {
					resolve(data);
				}
			});
		});

	const _call = async <T>(path: string, qs?: string) => {
		// We have to rely on jsonp because the Deezer api is CORS restricted
		const fullpath = qs
			? `${API_BASE}/${path}?${qs}&output=jsonp&callback=`
			: `${API_BASE}/${path}?output=jsonp&callback=`;
		return await _asyncJsonp<T>(fullpath);
	};

	const _search = <T>(type: MediaType, query: string) =>
		_call<ApiSearchResult<T>>(
			`search/${type}`,
			`q=${encodeURIComponent(query)}`
		);

	const _load = <T extends { error?: ApiError }>(
		type: MediaType,
		ids: string[]
	) =>
		Promise.all(
			ids.map(async id => {
				const media = await _call<T>(`${type}/${id}`);
				return media.error ? null : media;
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

	const searchAlbums = async (query: string) => {
		return (await _search<ApiAlbum>("album", query)).data.map(ConvertAlbum);
	};

	const searchPlaylists = async (query: string) => {
		return (await _search<ApiPlaylist>("playlist", query)).data
			.filter(playlist => playlist.public)
			.map(playlist => ConvertPlaylist(playlist, playlist.user!));
	};

	const searchTracks = async (query: string) => {
		return (await _search<ApiTrack>("track", query)).data
			.filter(track => track.readable && track.preview)
			.map(track => ConvertTrack(track, track.album));
	};

	const search = async (query: string) => {
		const [album, playlist, track] = await Promise.all([
			searchAlbums(query),
			searchPlaylists(query),
			searchTracks(query)
		]);
		return {
			// keys are MediaType
			album: album,
			playlist: playlist,
			track: track
		};
	};

	const loadAlbums = async (ids: string[]) => {
		const albums = await _loadWithRetry<ApiAlbum>("album", ids);
		return albums.map(album => ConvertAlbum(album));
	};

	const loadPlaylists = async (ids: string[]) => {
		const playlists = await _loadWithRetry<ApiPlaylist>("playlist", ids);
		return playlists.map(playlist =>
			ConvertPlaylist(playlist, playlist.creator!)
		);
	};

	const loadContainers = async (type: ContainerType, ids: string[]) => {
		switch (type) {
			case "album":
				return loadAlbums(ids);
			case "playlist":
				return loadPlaylists(ids);
		}
	};

	const loadTracks = async (ids: string[]): Promise<Track[]> => {
		const tracks = await _loadWithRetry<ApiTrack>("track", ids);
		return tracks.map(track => ConvertTrack(track, track.album));
	};

	return {
		search,
		searchAlbums,
		searchPlaylists,
		searchTracks,
		loadAlbums,
		loadContainers,
		loadPlaylists,
		loadTracks
	};
};

// ------------------------------------------------------------------

export const DEFAULT_API = DeezerApiImpl();
