import { decode } from "../../encoder";
import { augmentedArrayIndexAccess } from "../../";

// ------------------------------------------------------------------

export const GRID_CELL_COUNT = 10;
export const GRID_CELL_UNIT_SIZE = 40;
export const MAX_PLAYER_COUNT = 3;
export const INVALID_MOVE_MESSAGE_TAG = "invalid_move";

// ------------------------------------------------------------------

export type SeaBattleGrid = number[][];

// ------------------------------------------------------------------

export type SeaBattlePosition = { x: number; y: number };

export type SeaBattleAssetVisibility = "hidden" | "visible";

export type SeaBattleCellType =
	| "cell-crossed"
	| "cell-selected"
	| "cell-selection";

export type SeaBattleAssetType =
	| SeaBattleBoatType
	| SeaBattleCellType
	| SeaBattleHitType
	| SeaBattleWeaponType;

export type SeaBattleAssetData = {
	position: SeaBattlePosition;
};

// ------------------------------------------------------------------

export type SeaBattleDirection = "E" | "S" | "W" | "N";

export const SeaBattleDirections: SeaBattleDirection[] = ["E", "S", "W", "N"]; // order is important for AngleToDirection

export const AngleToDirection = (angle: number): SeaBattleDirection =>
	augmentedArrayIndexAccess(SeaBattleDirections, angle);

export type SeaBattleMovementType =
	| "move-forward"
	| "move-backward"
	| "rotate-left"
	| "rotate-right";

export type SeaBattleBoatStatus = "ok" | "ko";

export type SeaBattleBoatType = "boat1" | "boat2" | "boat3";

export type SeaBattleBoatData = SeaBattleAssetData & {
	angle: number;
	status: SeaBattleBoatStatus;
	type: SeaBattleBoatType;
};

export const BoatsOffsetMappings = {
	// Keys are boat types
	boat1: { x: 6, y: 6 },
	boat2: { x: 6, y: 6 },
	boat3: { x: 6, y: 6 }
};

// ------------------------------------------------------------------

export type SeaBattleCellData = SeaBattleAssetData & {
	type: SeaBattleCellType;
	visibility?: SeaBattleAssetVisibility;
};

// ------------------------------------------------------------------

export type SeaBattleHitType = "hitted1" | "hitted2" | "missed";

export type SeaBattleHitData = SeaBattleAssetData & { type: SeaBattleHitType };

export const HitsOffsetMappings = {
	// Keys are hits types
	hitted1: { x: 10, y: 10 },
	hitted2: { x: 10, y: 10 },
	missed: { x: 10, y: 10 }
};

// ------------------------------------------------------------------

export type SeaBattleWeaponType = "bullet1" | "bullet2" | "bullet3" | "mine";

export const SeaBattleWeaponTypes: SeaBattleWeaponType[] = [
	"bullet1",
	"bullet2",
	"bullet3",
	"mine"
];

export type SeaBattleWeaponData = SeaBattleAssetData & {
	opponentId: string;
	type: SeaBattleWeaponType;
};

export const WeaponsOffsetMappings = {
	// Keys are weapon types
	bullet1: { x: 12, y: 16 },
	bullet2: { x: 12, y: 16 },
	bullet3: { x: 12, y: 16 },
	mine: { x: 12, y: 12 }
};

// ------------------------------------------------------------------

export type SeaBattleMapData = {
	fleet: SeaBattleBoatData[];
	hits: SeaBattleHitData[];
	opponentsWeapons: SeaBattleWeaponData[]; // Weapons placed by opponents
	userId: string;
	weapons: {
		// Keys are weapon types
		[type: string]: number;
	};
};

// ------------------------------------------------------------------

export type SeaBattleData = {
	currentMapIndex: number;
	maps: SeaBattleMapData[];
};

// ------------------------------------------------------------------

export const generateBattle = (userId: string): SeaBattleData => {
	console.debug("[SeaBattle] Genering battle...");
	const battle: SeaBattleData = {
		currentMapIndex: 0,
		maps: []
	};
	generateFleet(battle, userId);
	return battle;
};

export const generateFleet = (battle: SeaBattleData, userId: string) => {
	const oldMap = battle.maps.find(other => other.userId === userId);
	if (oldMap) {
		return; // User already has a map in the battle
	}
	console.debug("[SeaBattle] Genering fleet...", {
		userId
	});
	battle.maps.push({
		fleet: [
			{
				type: "boat1",
				angle: 0,
				position: { x: 0, y: 0 },
				status: "ok"
			},
			{
				type: "boat1",
				angle: 0,
				position: { x: 1, y: 0 },
				status: "ko"
			},
			{
				type: "boat2",
				angle: 0,
				position: { x: 0, y: 1 },
				status: "ok"
			},
			{
				type: "boat2",
				angle: 0,
				position: { x: 2, y: 1 },
				status: "ko"
			},
			{
				type: "boat3",
				angle: 0,
				position: { x: 0, y: 2 },
				status: "ok"
			},
			{
				type: "boat3",
				angle: 0,
				position: { x: 3, y: 2 },
				status: "ko"
			}
		],
		hits: [
			/*
			{ position: { x: 0, y: 1 }, type: "hitted1" },
			{ position: { x: 0, y: 2 }, type: "hitted2" },
			{ position: { x: 0, y: 3 }, type: "missed" }
			*/
		],
		opponentsWeapons: [
			/*
			{position: { x: 0, y: 5 }, opponentId: '', type:'mine'}
			*/
		],
		userId,
		weapons: {
			// Keys are weapon types
			// Following counts are abitrary choices to validate/adjust ^_^ (TODO)
			bullet1: 100,
			bullet2: 6,
			bullet3: 3,
			mine: 3
		}
	});
};

// ------------------------------------------------------------------

export const extractOpponentMaps = (maps: SeaBattleMapData[], userId: string) =>
	Object.values(maps).filter(other => other.userId !== userId);

// ------------------------------------------------------------------

export const extractBattleInfo = ({
	extra,
	userId,
	boatIndex,
	weaponType
}: {
	extra: string;
	userId: string;
	boatIndex: number;
	weaponType?: SeaBattleWeaponType;
}): {
	boat?: SeaBattleBoatData;
	opponentMaps?: SeaBattleMapData[];
	playerMap?: SeaBattleMapData;
} => {
	let boat: SeaBattleBoatData | undefined = void 0;
	let opponentMaps: SeaBattleMapData[] | undefined = void 0;
	let playerMap: SeaBattleMapData | undefined = void 0;
	if (extra) {
		const battle = decode<SeaBattleData>(extra);
		if (userId) {
			playerMap = battle.maps.find(other => other.userId === userId);
			if (playerMap) {
				if (boatIndex >= 0 && boatIndex < playerMap.fleet.length) {
					boat = playerMap.fleet[boatIndex];
				}
			}
		}
		opponentMaps = extractOpponentMaps(battle.maps, userId);
	}
	return {
		boat,
		opponentMaps,
		playerMap
	};
};

// ------------------------------------------------------------------

export const passBatonToNextPlayer = (battle: SeaBattleData) => {
	battle.currentMapIndex = (battle.currentMapIndex + 1) % battle.maps.length;
};
