import { ApiPlaylist, ApiAlbum } from "./api";

export type Container = ApiAlbum | ApiPlaylist;

export type Containers = { [type_and_id: string]: Container };

export type ContainerType = "album" | "playlist";
