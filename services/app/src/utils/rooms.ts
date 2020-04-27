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
	name: string;
	type: RoomType;
};

export type RoomAccess = {
	dbId: string;
	roomId: string;
	secret: string;
};

export type RoomQueue = {
	medias?: RoomQueueMedias;
	position: number;
	playing: boolean;
	playmode: PlayMode;
};

export type RoomQueueMedias = {
	[index: string]: MediaAccess;
};

// ------------------------------------------------------------------

export const createQueueMerging = (
	accesses1: MediaAccess[],
	accesses2: MediaAccess[]
): RoomQueueMedias => {
	const medias: RoomQueueMedias = {};
	[...accesses1, ...accesses2].forEach(({ id, provider, type }, index) => {
		medias[index] = { id, provider, type };
	});
	return medias;
};

// ------------------------------------------------------------------

export const createQueueRemoving = (
	accesses: MediaAccess[],
	index: number,
	count: number
): RoomQueueMedias => {
	if (index < 0 || index >= accesses.length) {
		throw new Error("Media index is out of range");
	}
	const medias: RoomQueueMedias = {};
	const copy = [...accesses];
	copy.splice(index, count);
	copy.forEach(({ id, provider, type }, index) => {
		medias[index] = { id, provider, type };
	});
	return medias;
};

// ------------------------------------------------------------------

export const initializeRoom = ({
	type,
	userId
}: {
	type: RoomType;
	userId: string;
}): { extra: string; queue: RoomQueue } => {
	switch (type) {
		case "blind":
			return {
				extra: "",
				queue: {
					medias: {},
					playing: false,
					playmode: "default",
					position: 0
				}
			};
		case "dj":
			return {
				extra: "",
				queue: {
					medias: {},
					playing: false,
					playmode: "default",
					position: 0
				}
			};
		case "seabattle":
			return {
				extra: encodeBattle(generateBattle(userId)),
				queue: {
					medias: {
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
					playing: true,
					playmode: "shuffle",
					position: 0
				}
			};
	}
};
