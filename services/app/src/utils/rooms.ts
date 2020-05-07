import { encode } from "./encoder";
import { MediaAccess } from "./medias";
import {
	generateBattle,
	generateBattleQueue
} from "../games/seabattle/utils/generator";

// ------------------------------------------------------------------

export type PlayMode = "default" | "shuffle"; // TODO: Implement Shuffle mode

export type RoomType = "dj" | "seabattle";

export const DEFAULT_PLAY_MODE: PlayMode = "default";

export const DEFAULT_ROOM_TYPE: RoomType = "seabattle";

export const RoomTypes = ["dj", "seabattle"];

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
	accesses1: ReadonlyArray<MediaAccess>,
	accesses2: ReadonlyArray<MediaAccess>
): RoomQueueMedias => {
	const medias: RoomQueueMedias = {};
	[...accesses1, ...accesses2].forEach(({ id, provider, type }, index) => {
		medias[index] = { id, provider, type };
	});
	return medias;
};

// ------------------------------------------------------------------

export const createQueueRemoving = (
	accesses: ReadonlyArray<MediaAccess>,
	index: number,
	count: number
): RoomQueueMedias => {
	const medias: RoomQueueMedias = {};
	const copy = [...accesses];
	if (index < 0 || index >= accesses.length) {
		console.error("[Queue] Index is out of range");
	} else {
		copy.splice(index, count);
	}
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
				extra: encode(generateBattle(userId)),
				queue: generateBattleQueue()
			};
	}
};
