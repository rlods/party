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

// ------------------------------------------------------------------

export const createQueueMerging = (
	accesses1: MediaAccess[],
	accesses2: MediaAccess[]
) => {
	const queue: RoomQueue = {};
	[...accesses1, ...accesses2].forEach((media, index) => {
		queue[index] = media;
	});
	return queue;
};

// ------------------------------------------------------------------

export const createQueueRemoving = (
	accesses: MediaAccess[],
	index: number,
	count: number
) => {
	const queue: RoomQueue = {};
	const copy = [...accesses];
	copy.splice(index, count);
	copy.forEach((mediaAccess, index) => {
		queue[index] = mediaAccess;
	});
	return queue;
};
