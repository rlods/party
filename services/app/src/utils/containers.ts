import { LoadPlaylistItem, LoadAlbumItem } from "./api";

export type Container = LoadAlbumItem | LoadPlaylistItem;

export type Containers = { [type_and_id: string]: Container };
