import { MediaAccess } from "./medias";
import { generateBattle } from "./games/seabattle/generator";
import { encodeBattle } from "./games/seabattle";

// ------------------------------------------------------------------

export type PlayMode = "default" | "shuffle"; // TODO: Implement Shuffle mode

export type RoomType = "blind" | "dj" | "seabattle";

export const DEFAULT_PLAY_MODE: PlayMode = "default";

export const DEFAULT_ROOM_TYPE: RoomType = "seabattle";

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
	dbId: string;
	roomId: string;
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

export const initializeRoom = ({
	type,
	userId
}: {
	type: RoomType;
	userId: string;
}): Pick<
	RoomInfo,
	"extra" | "playing" | "playmode" | "queue" | "queue_position"
> => {
	switch (type) {
		case "blind":
			return {
				extra: "",
				playing: false,
				playmode: "default",
				queue: {},
				queue_position: 0
			};
		case "dj":
			return {
				extra: "",
				playing: false,
				playmode: "default",
				queue: {},
				queue_position: 0
			};
		case "seabattle":
			return {
				extra: encodeBattle(generateBattle(userId)),
				playing: true,
				playmode: "shuffle",
				queue: {
					0: {
						id: "301013", // Pirates Of The Caribbean OST
						provider: "deezer",
						type: "album"
					},
					1: {
						id: "7358507", // Stalingrad OST
						provider: "deezer",
						type: "album"
					},
					2: {
						id: "558976", // Master & Commander OST
						provider: "deezer",
						type: "album"
					},
					3: {
						id: "87375582", // Le chant du loup OST
						provider: "deezer",
						type: "album"
					}
				},
				queue_position: 0
			};
	}
};
