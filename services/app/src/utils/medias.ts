import { ApiAlbum, ApiPlaylist, ApiTrack } from "./deezer";

export type Album = ApiAlbum;

export type Playlist = ApiPlaylist;

export type Media = Album | Playlist | Track;

export type MediaAccess = { id: string; provider: Provider; type: MediaType };

export type MediaType = "album" | "playlist" | "track";

export type Provider = "deezer";

export type Track = ApiTrack;

export type TrackType = "track";
