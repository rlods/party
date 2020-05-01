import {
	Media,
	MediaAccess,
	StructuredMedias,
	Album,
	Playlist,
	Track,
	MediaType,
	ProviderType
} from "../medias";
import { getDeezerApi } from "./deezer";
import { getSpotifyApi } from "./spotify";

// ------------------------------------------------------------------

export type SearchOptions = {
	limit?: number;
};

export type SearchResults = {
	[provider in ProviderType]: {
		album: Album[];
		playlist: Playlist[];
		track: Track[];
	};
};

export type ProviderApi = {
	loadAlbums: (ids: string[]) => Promise<Album[]>;

	loadPlaylists: (ids: string[]) => Promise<Playlist[]>;

	loadTracks: (ids: string[]) => Promise<Track[]>;

	searchAlbums: (query: string, options?: SearchOptions) => Promise<Album[]>;

	searchPlaylists: (
		query: string,
		options?: SearchOptions
	) => Promise<Playlist[]>;

	searchTracks: (query: string, options?: SearchOptions) => Promise<Track[]>;
};

// ------------------------------------------------------------------

export const loadMedias = async (accesses: MediaAccess[]): Promise<Media[]> => {
	const ids: {
		[provider in ProviderType]: {
			[media in MediaType]: string[];
		};
	} = {
		deezer: {
			album: [],
			playlist: [],
			track: []
		},
		spotify: {
			album: [],
			playlist: [],
			track: []
		}
	};
	for (const access of accesses) {
		ids[access.provider][access.type].push(access.id);
	}
	const deezerApi = getDeezerApi();
	const spotifyApi = getSpotifyApi();
	const medias: SearchResults = {
		deezer: {
			album: await deezerApi.loadAlbums(ids.deezer.album),
			playlist: await deezerApi.loadPlaylists(ids.deezer.playlist),
			track: await deezerApi.loadTracks(ids.deezer.track)
		},
		spotify: {
			album: await spotifyApi.loadAlbums(ids.spotify.album),
			playlist: await spotifyApi.loadPlaylists(ids.spotify.playlist),
			track: await spotifyApi.loadTracks(ids.spotify.track)
		}
	};
	const flatten: Media[] = [];
	for (const access of accesses) {
		const media = (medias[access.provider][access.type] as Media[]).find(
			other => other.id === access.id
		);
		if (media) {
			flatten.push(media);
		}
	}
	return flatten;
};

// ------------------------------------------------------------------

export const loadNewMedias = async (
	accesses: MediaAccess[],
	oldMedias: StructuredMedias
): Promise<{
	newMedias: Media[];
	newMediasAndTracks: Media[];
}> => {
	const newAccesses: MediaAccess[] = accesses
		// Only not already loaded
		.filter(access => !oldMedias[access.provider][access.type][access.id])
		// Only unique
		.filter(
			(value, index, self) =>
				index ===
				self.findIndex(
					other =>
						other.id === value.id &&
						other.provider === value.provider &&
						other.type === value.type
				)
		);
	const newMedias = await loadMedias(newAccesses);
	const newMediasAndTracks: Media[] = [];
	for (const media of newMedias) {
		newMediasAndTracks.push(media);
		if (media.type !== "track") {
			newMediasAndTracks.push(...media.tracks);
		}
	}
	return { newMedias, newMediasAndTracks };
};
// ------------------------------------------------------------------

export const searchMedias = async (
	q: string,
	options?: SearchOptions,
	providerType?: ProviderType,
	mediaType?: MediaType
): Promise<SearchResults> => {
	const deezerApi = getDeezerApi();
	const spotifyApi = getSpotifyApi();
	if (!providerType || !mediaType) {
		const [
			deezerAlbums,
			deezerPlaylists,
			deezerTracks,
			spotifyAlbums,
			spotifyPlaylists,
			spotifyTracks
		] = await Promise.all([
			deezerApi.searchAlbums(q, options),
			deezerApi.searchPlaylists(q, options),
			deezerApi.searchTracks(q, options),
			spotifyApi.searchAlbums(q, options),
			spotifyApi.searchPlaylists(q, options),
			spotifyApi.searchTracks(q, options)
		]);
		return {
			deezer: {
				album: deezerAlbums,
				playlist: deezerPlaylists,
				track: deezerTracks
			},
			spotify: {
				album: spotifyAlbums,
				playlist: spotifyPlaylists,
				track: spotifyTracks
			}
		};
	}
	const results: SearchResults = {
		deezer: {
			album: [],
			playlist: [],
			track: []
		},
		spotify: {
			album: [],
			playlist: [],
			track: []
		}
	};
	const collection = results[providerType];
	const providerApi = providerType === "deezer" ? deezerApi : spotifyApi;
	switch (mediaType) {
		case "album":
			collection.album = await providerApi.searchAlbums(q, options);
			break;
		case "playlist":
			collection.playlist = await providerApi.searchPlaylists(q, options);
			break;
		case "track":
			collection.track = await providerApi.searchTracks(q, options);
			break;
	}
	return results;
};
