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

export const createQueueMerging = (
	accesses1: MediaAccess[],
	accesses2: MediaAccess[]
): RoomQueue => {
	const queue: RoomQueue = {};
	[...accesses1, ...accesses2].forEach(({ id, provider, type }, index) => {
		queue[index] = { id, provider, type };
	});
	return queue;
};

// ------------------------------------------------------------------

export const createQueueRemoving = (
	accesses: MediaAccess[],
	index: number,
	count: number
): RoomQueue => {
	if (index < 0 || index >= accesses.length) {
		throw new Error("Media index is out of range");
	}

	const queue: RoomQueue = {};
	const copy = [...accesses];
	copy.splice(index, count);
	copy.forEach(({ id, provider, type }, index) => {
		queue[index] = { id, provider, type };
	});
	return queue;
};
