export type ContainerType = "album" | "playlist";

export type MediaType = ContainerType | "track";

export type MediaTypeDefinition = {
	label: string;
	provider: ProviderType;
	type: MediaType;
};

export type ProviderType = "deezer";

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
	title: string;
	tracks?: Track[];
	type: "album";
};

export type Playlist = {
	id: string;
	link: string;
	picture_big: string;
	picture_small: string;
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
	title: string;
	type: "track";
};

export type Container = Album | Playlist;

export type Media = Container | Track;

// ------------------------------------------------------------------

export type SearchResults = {
	// keys are MediaType
	album: Album[];
	playlist: Playlist[];
	track: Track[];
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
