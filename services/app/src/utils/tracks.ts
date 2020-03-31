import { LoadTrackItem } from "./api";

export type Track = LoadTrackItem;

export type Tracks = { [id: string]: Track };
