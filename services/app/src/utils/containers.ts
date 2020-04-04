import { ApiPlaylist, ApiAlbum } from "./deezer";

export type Container = ApiAlbum | ApiPlaylist;

export type Containers = { [type_and_id: string]: Container };

export type ContainerType = "album" | "playlist";

export type MediaType = ContainerType | "track";
