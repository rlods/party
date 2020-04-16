import {
	SearchOptions,
	SearchResults,
	Media,
	MediaAccess,
	StructuredMedias
} from "./medias";
import { DEFAULT_API } from "./deezer";

// ------------------------------------------------------------------

export const load = async (accesses: MediaAccess[]): Promise<Media[]> => {
	const ids: {
		deezer: { album: string[]; playlist: string[]; track: string[] };
	} = {
		// keys are ProviderType
		deezer: {
			// keys are MediaType
			album: [],
			playlist: [],
			track: []
		}
	};
	for (const access of accesses) {
		ids[access.provider][access.type].push(access.id);
	}
	const medias = {
		// keys are ProviderType
		deezer: {
			// keys are MediaType
			album: await DEFAULT_API.loadAlbums(ids.deezer.album),
			playlist: await DEFAULT_API.loadPlaylists(ids.deezer.playlist),
			track: await DEFAULT_API.loadTracks(ids.deezer.track)
		}
	};
	return accesses.map(
		access =>
			medias[access.provider][access.type][
				ids[access.provider][access.type].indexOf(access.id)
			]
	);
};

// ------------------------------------------------------------------

export const loadNew = async (
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
	const newMedias = await load(newAccesses);
	const newMediasAndTracks: Media[] = [];
	for (const media of newMedias) {
		newMediasAndTracks.push(media);
		if (media.type !== "track") {
			newMediasAndTracks.push(...media.tracks!);
		}
	}
	return { newMedias, newMediasAndTracks };
};
// ------------------------------------------------------------------

export const search = async (
	query: string,
	options?: SearchOptions
): Promise<SearchResults> => {
	const [album, playlist, track] = await Promise.all([
		DEFAULT_API.searchAlbums(query, options),
		DEFAULT_API.searchPlaylists(query, options),
		DEFAULT_API.searchTracks(query, options)
	]);
	return {
		// keys are ProviderType
		deezer: {
			// keys are MediaType
			album: album,
			playlist: playlist,
			track: track
		}
	};
};
