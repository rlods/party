import { ApiAlbum, ApiPlaylist, ApiTrack } from "./deezer";

export type Album = ApiAlbum;

export type Playlist = ApiPlaylist;

export type Container = Album | Playlist;

export type ContainerType = "album" | "playlist";

export type MediaType = ContainerType | TrackType;

export type Provider = "deezer";

export type Track = ApiTrack;

export type TrackType = "track";
