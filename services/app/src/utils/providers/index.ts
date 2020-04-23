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
import { DEFAULT_API } from "./deezer";

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
		}
	};
	for (const access of accesses) {
		ids[access.provider][access.type].push(access.id);
	}
	const medias: SearchResults = {
		deezer: {
			album: await DEFAULT_API.loadAlbums(ids.deezer.album),
			playlist: await DEFAULT_API.loadPlaylists(ids.deezer.playlist),
			track: await DEFAULT_API.loadTracks(ids.deezer.track)
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
	query: string,
	options?: SearchOptions,
	type?: MediaType
): Promise<SearchResults> => {
	if (!type) {
		const [album, playlist, track] = await Promise.all([
			DEFAULT_API.searchAlbums(query, options),
			DEFAULT_API.searchPlaylists(query, options),
			DEFAULT_API.searchTracks(query, options)
		]);
		return {
			deezer: {
				album: album,
				playlist: playlist,
				track: track
			}
		};
	}
	const results: SearchResults = {
		deezer: {
			album: [],
			playlist: [],
			track: []
		}
	};
	switch (type) {
		case "album":
			results.deezer.album = await DEFAULT_API.searchAlbums(
				query,
				options
			);
			break;
		case "playlist":
			results.deezer.playlist = await DEFAULT_API.searchPlaylists(
				query,
				options
			);
			break;
		case "track":
			results.deezer.track = await DEFAULT_API.searchTracks(
				query,
				options
			);
			break;
	}
	return results;
};
