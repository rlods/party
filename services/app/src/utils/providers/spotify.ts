import axios from "axios";
//
import { Album, MediaType, Playlist, Track } from "../medias";
import { SearchOptions, ProviderApi } from "../providers";
import { sleep } from "..";

// ------------------------------------------------------------------

const API_BASE = "https://proxy.rlods.now.sh/api/spotify";
const WWW_BASE = "https://open.spotify.com";
const RATE_LIMIT_DELAY = 5000; // ms
const BATCH_CHUNK_SIZE = 50;
const DEFAULT_LIMIT = 10;

// ------------------------------------------------------------------

export type SpotifyApiArtist = {
	id: string;
	name: string;
};

export type SpotifyApiImage = {
	height: number;
	url: string;
	width: number;
};

export type SpotifyApiUser = {
	display_name: string;
	id: string;
};

// ------------------------------------------------------------------

export type SpotifyApiAlbum = {
	artists: SpotifyApiArtist[];
	id: string;
	images: SpotifyApiImage[];
	name: string;
	tracks?: {
		items: SpotifyApiTrack[];
		total: number;
	};
	total_tracks: number;
};

export type SpotifyApiPlaylist = {
	description: string;
	id: string;
	images: SpotifyApiImage[];
	name: string;
	owners: SpotifyApiUser[];
	public: boolean;
	tracks?: {
		items: SpotifyApiTrack[];
		total: number;
	};
};

export type SpotifyApiTrack = {
	album?: SpotifyApiAlbum;
	artists: SpotifyApiArtist[];
	id: string;
	name: string;
	preview_url: string | null;
};

// ------------------------------------------------------------------

const ConvertAlbum = (album: SpotifyApiAlbum): Album => ({
	artist: {
		id: album.artists[0].id.toString(),
		name: album.artists[0].name,
		link: `${WWW_BASE}/artist/${album.artists[0].id}`
	},
	id: album.id,
	link: `${WWW_BASE}/album/${album.id}`,
	name: album.name,
	picture_big: album.images[0].url, // TODO
	picture_small: album.images[0].url, // TODO
	provider: "spotify",
	tracks:
		album.tracks !== void 0
			? album.tracks.items
					.filter(track => track.preview_url)
					.map(track => ConvertTrack(track, album))
			: [],
	type: "album"
});

const ConvertPlaylist = (playlist: SpotifyApiPlaylist): Playlist => ({
	id: playlist.id,
	link: `${WWW_BASE}/playlist/${playlist.id}`,
	name: playlist.name,
	picture_big: playlist.images[0].url, // TODO
	picture_small: playlist.images[0].url, // TODO
	provider: "spotify",
	tracks:
		playlist.tracks !== void 0
			? playlist.tracks.items
					.filter(track => track.preview_url)
					.map(track => ConvertTrack(track, track.album!))
			: [],
	type: "playlist",
	user: {
		id: playlist.owners[0].id,
		link: `${WWW_BASE}/user/${playlist.owners[0].id}`,
		name: playlist.owners[0].display_name
	}
});

const ConvertTrack = (
	track: SpotifyApiTrack,
	album: SpotifyApiAlbum
): Track => ({
	album: {
		id: album.id,
		link: `${WWW_BASE}/album/${album.id}`,
		name: album.name,
		picture_big: album.images[0].url, // TODO
		picture_small: album.images[0].url // TODO
	},
	artist: {
		id: track.artists[0].id,
		name: track.artists[0].name,
		link: `${WWW_BASE}/artist/${track.artists[0].id}`
	},
	id: track.id,
	link: `${WWW_BASE}/track/${track.id}`,
	name: track.name,
	preview: track.preview_url || "",
	provider: "spotify",
	type: "track"
});

// ------------------------------------------------------------------

const SpotifyApiImpl = (): ProviderApi => {
	const _call = async (path: string, params?: { [key: string]: string }) => {
		console.debug("[Spotify] Requesting... ", { path, params });
		return (await axios.get(`${API_BASE}/${path}`, { params })).data;
	};

	const _search = (type: MediaType, query: string, options?: SearchOptions) =>
		_call("search", {
			limit: (options?.limit || DEFAULT_LIMIT).toString(),
			market: "US",
			q: encodeURIComponent(query),
			type: type
		});

	const chunkArray = <T>(arr: T[], chunkSize: number) => {
		const length = arr.length;
		const res: T[][] = [];
		for (let index = 0; index < length; index += chunkSize) {
			res.push(arr.slice(index, index + chunkSize));
		}
		return res;
	};

	const _load = async <T>(
		type: MediaType,
		ids: string[]
	): Promise<{
		delayedIds: string[];
		failedIds: string[];
		loadedMedias: T[];
	}> => {
		const delayedIds: string[] = [];
		const failedIds: string[] = [];
		const loadedMedias: T[] = [];
		await Promise.all(
			chunkArray(ids, BATCH_CHUNK_SIZE).map(async ids => {
				const medias = (
					await _call("load", {
						ids: ids.join(","),
						market: "US",
						type
					})
				)[`${type}s`] as T[];
				console.log("[Spotify] Loaded media", { type, ids, medias });
				loadedMedias.push(...medias);
				/*
				if (!media.error) {
					loadedMedias.push(media);
					return;
				}
				if (media.error.code === 4) {
					delayedIds.push(id);
					return; // Quota limit exceeded, do not throw so that it will be retried later
				}
				console.error(
					`[Spotify] An error occured while loading ${type}:`,
					media.error
				);
				failedIds.push(id);
				*/
			})
		);
		return { delayedIds, failedIds, loadedMedias };
	};

	const _loadWithRetry = async <T>(
		type: MediaType,
		ids: string[]
	): Promise<T[]> => {
		const res: T[] = [];
		let first = true;
		let remainingIds = [...ids];
		while (remainingIds.length > 0) {
			if (!first) {
				console.debug(
					`[Spotify] Handling rate limit delayed batch...`,
					{
						remainingIds
					}
				);
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
		options?: SearchOptions
	): Promise<Album[]> => {
		if (query.trim().length === 0) {
			return [];
		}
		const res = (await _search("album", query, options)) as {
			albums: {
				items: SpotifyApiAlbum[];
				total: number;
			};
		};
		return res.albums.items.map(ConvertAlbum);
	};

	const searchPlaylists = async (
		query: string,
		options?: SearchOptions
	): Promise<Playlist[]> => {
		if (query.trim().length === 0) {
			return [];
		}
		const res = (await _search("playlist", query, options)) as {
			playlists: {
				items: SpotifyApiPlaylist[];
				total: number;
			};
		};
		return res.playlists.items
			.filter(playlist => playlist.public)
			.map(ConvertPlaylist);
	};

	const searchTracks = async (
		query: string,
		options?: SearchOptions
	): Promise<Track[]> => {
		if (query.trim().length === 0) {
			return [];
		}
		const res = (await _search("track", query, options)) as {
			tracks: {
				items: SpotifyApiTrack[];
				total: number;
			};
		};
		return res.tracks.items
			.filter(track => track.preview_url)
			.map(track => ConvertTrack(track, track.album!));
	};

	const loadAlbums = async (ids: string[]): Promise<Album[]> => {
		if (ids.length === 0) {
			return [];
		}
		console.debug("[Spotify] Loading albums...", { ids });
		const albums = await _loadWithRetry<SpotifyApiAlbum>("album", ids);
		return albums.map(ConvertAlbum);
	};

	const loadPlaylists = async (ids: string[]): Promise<Playlist[]> => {
		if (ids.length === 0) {
			return [];
		}
		console.debug("[Spotify] Loading playlists...", { ids });
		const playlists = await _loadWithRetry<SpotifyApiPlaylist>(
			"playlist",
			ids
		);
		return playlists.map(ConvertPlaylist);
	};

	const loadTracks = async (ids: string[]): Promise<Track[]> => {
		if (ids.length === 0) {
			return [];
		}
		console.debug("[Spotify] Loading tracks...", { ids });
		const tracks = await _loadWithRetry<SpotifyApiTrack>("track", ids);
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

export const getSpotifyApi = (): ProviderApi => {
	if (!DEFAULT_IMPL) {
		DEFAULT_IMPL = SpotifyApiImpl();
	}
	return DEFAULT_IMPL;
};
