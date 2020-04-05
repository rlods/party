import { ApiAlbum, ApiPlaylist, ApiTrack } from "./deezer";

export type Album = ApiAlbum;

export type Playlist = ApiPlaylist;

export type Media = Album | Playlist | Track;

export type MediaAccess = { id: string; provider: Provider; type: MediaType };

export type MediaType = "album" | "playlist" | "track";

export type MediaTypeDefinition = {
  label: string;
  provider: Provider;
  type: MediaType;
};

export type Provider = "deezer";

export type Track = ApiTrack;

export type TrackType = "track";

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
