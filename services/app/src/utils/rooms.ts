import { MediaAccess } from "./medias";
import { generateBattle } from "./games/seabattle";
import { encode } from "./encoder";

export type PlayMode = "default" | "shuffle"; // TODO: Implement Shuffle mode

export type RoomType = "blind" | "dj" | "seabattle";

export const DEFAULT_PLAY_MODE: PlayMode = "default";

export const DEFAULT_ROOM_TYPE: RoomType = "dj";

export const RoomTypes = [
	// "blind",
	"dj",
	"seabattle"
];

export type RoomInfo = {
	extra: string;
	name: string;
	queue?: RoomQueue;
	queue_position: number;
	playing: boolean;
	playmode: PlayMode;
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

// ------------------------------------------------------------------

export const generateRoomExtra = (userId: string, type: RoomType): string => {
	switch (type) {
		case "blind":
			return "";
		case "dj":
			return "";
		case "seabattle":
			return encode(generateBattle(userId));
	}
};
