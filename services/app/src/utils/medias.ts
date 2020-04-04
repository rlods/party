import { ApiAlbum, ApiPlaylist, ApiTrack } from "./deezer";

export type Container = ApiAlbum | ApiPlaylist;

export type Containers = { [type_and_id: string]: Container };

export type ContainerType = "album" | "playlist";

export type MediaType = ContainerType | TrackType;

export type ProviderType = "deezer";

export type Track = ApiTrack;

export type TrackType = "track";
