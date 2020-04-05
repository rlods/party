export type MediaAccess = {
  id: string;
  provider: ProviderType;
  type: MediaType;
};

export type MediaType = "album" | "playlist" | "track";

export type MediaTypeDefinition = {
  label: string;
  provider: ProviderType;
  type: MediaType;
};

export type ProviderType = "deezer";

export type TrackType = "track";

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
  public: true;
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
  readable: boolean;
  title: string;
  type: "track";
};

export type Media = Album | Playlist | Track;

// ------------------------------------------------------------------

export type SearchResult<T> = {
  data: T[];
  total: number;
};

export type SearchAllResults = {
  // keys are MediaType
  album: SearchResult<Album>;
  playlist: SearchResult<Playlist>;
  track: SearchResult<Track>;
};

// ------------------------------------------------------------------

export const MEDIA_TYPE_DEFINITIONS: MediaTypeDefinition[] = [
  {
    label: "medias.albums",
    provider: "deezer",
    type: "album",
  },
  {
    label: "medias.playlists",
    provider: "deezer",
    type: "playlist",
  },
  {
    label: "medias.tracks",
    provider: "deezer",
    type: "track",
  },
];
