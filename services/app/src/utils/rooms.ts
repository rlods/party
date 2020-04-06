import { MediaAccess } from "./medias";

export type RoomType = "blind" | "dj";

export type RoomInfo = {
	name: string;
	queue?: RoomQueue;
	queue_position: number;
	playing: boolean;
	timestamp: number;
	type: RoomType;
};

export type RoomAccess = {
	id: string;
	secret: string;
};

export type RoomQueue = {
	[index: string]: MediaAccess;
};

// ------------------------------------------------------------------

export const createSharingUrl = (id: string) =>
	`${window.location.origin}/#/room/${id}`;
