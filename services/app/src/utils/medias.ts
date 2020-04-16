export type ContainerType = "album" | "playlist";

export type MediaType = ContainerType | "track";

export const MediaTypes: MediaType[] = ["album", "playlist", "track"];

export type MediaTypeDefinition = {
	label: string;
	provider: ProviderType;
	type: MediaType;
};

export type ProviderType = "deezer";

export const ProviderTypes: ProviderType[] = ["deezer"];

export type TrackType = "track";

// ------------------------------------------------------------------

export type AlbumAccess = {
	id: string;
	provider: ProviderType;
	type: "album";
};

export type PlaylistAccess = {
	id: string;
	provider: ProviderType;
	type: "playlist";
};

export type TrackAccess = {
	id: string;
	provider: ProviderType;
	type: "track";
};

export type ContainerAccess = AlbumAccess | PlaylistAccess;

export type MediaAccess = ContainerAccess | TrackAccess;

export type ContextualizedTrackAccess = {
	contextId: string;
	contextType: MediaType;
} & TrackAccess;

// ------------------------------------------------------------------

export type Album = {
	artist: {
		id: string;
		link: string;
		name: string;
		picture_big: string;
		picture_small: string;
	};
	cover_big: string;
	cover_small: string;
	id: string;
	link: string;
	provider: ProviderType;
	title: string;
	tracks?: Track[];
	type: "album";
};

export type Playlist = {
	id: string;
	link: string;
	picture_big: string;
	picture_small: string;
	provider: ProviderType;
	title: string;
	tracks?: Track[];
	type: "playlist";
	user: {
		id: string;
		link: string;
		name: string;
	};
};

export type Track = {
	album: {
		cover_big: string;
		cover_small: string;
		id: string;
		link: string;
		title: string;
	};
	artist: {
		id: string;
		name: string;
		link: string;
		picture_big: string;
		picture_small: string;
	};
	duration: number;
	id: string;
	link: string;
	preview: string;
	provider: ProviderType;
	title: string;
	type: "track";
};

export type Container = Album | Playlist;

export type Media = Container | Track;

export type StructuredMedias = {
	// keys are ProvideType
	deezer: {
		// keys are MediaType
		album: { [id: string]: Album };
		playlist: { [id: string]: Playlist };
		track: { [id: string]: Track };
	};
};

// ------------------------------------------------------------------

export type SearchOptions = {
	limit?: number;
};

export type SearchResults = {
	// keys are ProviderType
	deezer: {
		// keys are MediaType
		album: Album[];
		playlist: Playlist[];
		track: Track[];
	};
};

// ------------------------------------------------------------------

export const MEDIA_TYPE_DEFINITIONS: MediaTypeDefinition[] = [
	{
		label: "medias.albums",
		provider: "deezer",
		type: "album"
	},
	{
		label: "medias.playlists",
		provider: "deezer",
		type: "playlist"
	},
	{
		label: "medias.tracks",
		provider: "deezer",
		type: "track"
	}
];

// ------------------------------------------------------------------

const findMediaInDict = (
	access: MediaAccess,
	medias: StructuredMedias
): Media | undefined => medias[access.provider][access.type][access.id];

// ------------------------------------------------------------------

const findMediaInList = (
	access: MediaAccess,
	medias: Media[]
): Media | undefined =>
	medias.find(
		item =>
			item.id === access.id &&
			item.provider === access.provider &&
			item.type === access.type
	);

// ------------------------------------------------------------------

export const findMedia = (
	access: MediaAccess,
	dist: StructuredMedias,
	list: Media[]
): Media | undefined =>
	findMediaInDict(access, dist) || findMediaInList(access, list);

// ------------------------------------------------------------------

export const findPreview = (
	access: MediaAccess,
	oldMedias: StructuredMedias,
	newMedias: Media[]
): Track | null => {
	const media = findMedia(access, oldMedias, newMedias);
	if (!media) {
		return null;
	}
	if (media.type === "track") {
		return media;
	}
	if (media.tracks && media.tracks.length > 0) {
		return media.tracks[0];
	}
	return null;
};

// ------------------------------------------------------------------

export const extractTracks = (
	accesses: MediaAccess[],
	oldMedias: StructuredMedias,
	newMedias: Media[]
): ContextualizedTrackAccess[] => {
	const tracks: ContextualizedTrackAccess[] = [];
	for (const access of accesses) {
		if (access.type === "track") {
			tracks.push({
				contextId: access.id,
				contextType: access.type,
				id: access.id,
				provider: access.provider,
				type: access.type
			});
			continue;
		}

		const container = findMedia(access, oldMedias, newMedias);
		if (!container) {
			throw new Error("Media is unknown");
		}

		if (
			container.type !== "track" &&
			container.tracks &&
			container.tracks.length > 0
		) {
			for (const track of container.tracks) {
				tracks.push({
					contextId: container.id,
					contextType: container.type,
					id: track.id,
					provider: track.provider,
					type: track.type
				});
			}
		}
	}
	return tracks;
};

// ------------------------------------------------------------------

export const findContextFromTrackIndex = (
	medias: MediaAccess[],
	trackIndex: number,
	allMedias: StructuredMedias
): {
	mediaFirstTrackIndex: number;
	mediaIndex: number;
	mediaSize: number;
} => {
	if (trackIndex < 0) {
		throw new Error("Track index is out of range");
	}
	let index = 0;
	for (let mediaIndex = 0; mediaIndex < medias.length; ++mediaIndex) {
		const media = medias[mediaIndex];
		if (media.type === "track") {
			if (trackIndex === index) {
				return {
					mediaFirstTrackIndex: trackIndex,
					mediaIndex,
					mediaSize: 1
				};
			}
			index++;
		} else {
			const container = findMediaInDict(media, allMedias);
			if (!container) {
				throw new Error("Media is unknown");
			}

			if (
				container.type !== "track" &&
				container.tracks &&
				container.tracks.length > 0
			) {
				const mediaFirstTrackIndex = index;
				for (let i = 0; i < container.tracks.length; ++i) {
					if (trackIndex === index) {
						return {
							mediaFirstTrackIndex,
							mediaIndex,
							mediaSize: container.tracks.length
						};
					}
					index++;
				}
			}
		}
	}
	throw new Error("Track index is out of range");
};
