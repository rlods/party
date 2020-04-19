import { decode } from "../../encoder";
import { generateGrid } from "./collision";
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

export type SeaBattleHitType = "hitted1" | "hitted2" | "missed1" | "missed2";

export type SeaBattleHitData = SeaBattleAssetData & { type: SeaBattleHitType };

export const HitsOffsetMappings = {
	hitted1: { x: 10, y: 10 },
	hitted2: { x: 10, y: 10 },
	missed1: { x: 10, y: 10 },
	missed2: { x: 10, y: 10 }
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
	weapons: {
		[type: string]: number;
	};
};

// ------------------------------------------------------------------

export type SeaBattleData = {
	maps: { [id: string]: SeaBattleMapData };
};

// ------------------------------------------------------------------

export const generateBattle = (userId: string): SeaBattleData => {
	console.debug("[SeaBattle] Genering battle...");
	const battle: SeaBattleData = {
		maps: {}
	};
	generateFleet(battle, userId);
	return battle;
};

export const generateFleet = (battle: SeaBattleData, userId: string) => {
	console.debug("[SeaBattle] Genering fleet...", {
		userId
	});
	battle.maps[userId] = {
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
			{ position: { x: 0, y: 1 }, type: "hitted1" },
			{ position: { x: 0, y: 2 }, type: "hitted2" },
			{ position: { x: 0, y: 3 }, type: "missed1" },
			{ position: { x: 0, y: 4 }, type: "missed2" }
		],
		opponentsWeapons: [],
		weapons: { mine: 1 }
	};
};

// ------------------------------------------------------------------

export const extractBattleInfo = ({
	extra,
	userId,
	boatIndex,
	opponentIndex,
	weaponType
}: {
	extra: string;
	userId: string;
	boatIndex: number;
	opponentIndex: number;
	weaponType?: SeaBattleWeaponType;
}): {
	battle?: SeaBattleData;
	boat?: SeaBattleBoatData;
	opponentMap?: SeaBattleMapData;
	opponentMaps?: SeaBattleMapData[];
	playerMap?: SeaBattleMapData;
	weaponCount: number;
} => {
	let battle: SeaBattleData | undefined = void 0;
	let boat: SeaBattleBoatData | undefined = void 0;
	let opponentMap: SeaBattleMapData | undefined = void 0;
	let opponentMaps: SeaBattleMapData[] | undefined = void 0;
	let playerMap: SeaBattleMapData | undefined = void 0;
	let weaponCount = 0;
	if (extra) {
		battle = decode<SeaBattleData>(extra);
		if (userId) {
			playerMap = battle.maps[userId];
			if (playerMap) {
				if (boatIndex >= 0 && boatIndex < playerMap.fleet.length) {
					boat = playerMap.fleet[boatIndex];
				}
				if (weaponType) {
					weaponCount = playerMap.weapons[weaponType] || 0;
				}
			}
		}
		opponentMaps = Object.values(battle.maps).filter(
			other => other !== playerMap
		);
		if (opponentIndex >= 0 && opponentIndex < opponentMaps.length) {
			opponentMap = opponentMaps[opponentIndex];
		}
	}
	return {
		battle,
		boat,
		opponentMap,
		opponentMaps,
		playerMap,
		weaponCount
	};
};

// ------------------------------------------------------------------

export const testHit = (
	player: SeaBattleMapData,
	opponent: SeaBattleMapData,
	position: SeaBattlePosition,
	weaponCount: number
) => {
	const grid = generateGrid(opponent.fleet);
	return grid[position.y][position.x] > 0;
};
