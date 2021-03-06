import { augmentedArrayIndexAccess } from "../../../utils";

// ------------------------------------------------------------------

export const GRID_CELL_COUNT = 10;
export const GRID_CELL_UNIT_SIZE = 40;
export const MAX_PLAYER_COUNT = 3;

// ------------------------------------------------------------------

export type SeaBattleGridCell =
	| {
			boatIndex: number;
			boatLocalIndex: number;
			type: "boat";
	  }
	| {
			weaponType: SeaBattleWeaponType;
			type: "weapon";
	  }
	| null;

export type SeaBattleGrid = SeaBattleGridCell[][];

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

// ------------------------------------------------------------------

export type SeaBattleDirection = "E" | "S" | "W" | "N";

export const SeaBattleDirections: SeaBattleDirection[] = ["E", "S", "W", "N"]; // order is important for AngleToDirection

export const AngleToDirection = (angle: number): SeaBattleDirection =>
	augmentedArrayIndexAccess(SeaBattleDirections, angle);

export const DirectionToAngle: {
	[type in SeaBattleDirection]: number;
} = {
	E: 0,
	S: 1,
	W: 2,
	N: 3
};

export type SeaBattleRotationType = "rotate_left" | "rotate_right";

export type SeaBattleTranslationType = "move_forward" | "move_backward";

export type SeaBattleMovementType =
	| SeaBattleTranslationType
	| SeaBattleRotationType;

export type SeaBattleBoatStatus = "ok" | "ko";

export type SeaBattleBoatType = "boat1" | "boat2" | "boat3";

export const SeaBattleBoatTypes: SeaBattleBoatType[] = [
	"boat1",
	"boat2",
	"boat3"
];

export type SeaBattleBoatData = {
	angle: number;
	hits: SeaBattleHitData[];
	position: SeaBattlePosition;
	status: SeaBattleBoatStatus;
	type: SeaBattleBoatType;
};

export const BoatsOffsetMappings: {
	[type in SeaBattleBoatType]: SeaBattlePosition;
} = {
	boat1: { x: 6, y: 6 },
	boat2: { x: 6, y: 6 },
	boat3: { x: 6, y: 6 }
};

export type SeaBattleFleetSet = {
	[type in SeaBattleBoatType]: number;
};

// ------------------------------------------------------------------

export type SeaBattleCellData = {
	position: SeaBattlePosition;
	type: SeaBattleCellType;
	visibility?: SeaBattleAssetVisibility;
};

// ------------------------------------------------------------------

export type SeaBattleHitType = "hitted" | "missed";

export type SeaBattleHitData = {
	position: SeaBattlePosition;
	type: SeaBattleHitType;
};

export const HitsOffsetInBoatMappings: {
	[type in SeaBattleHitType]: SeaBattlePosition;
} = {
	hitted: { x: 4, y: 4 },
	missed: { x: 4, y: 4 }
};

export const HitsOffsetInCellMappings: {
	[type in SeaBattleHitType]: SeaBattlePosition;
} = {
	hitted: { x: 10, y: 10 },
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

export type SeaBattleWeaponData = {
	opponentId: string;
	position: SeaBattlePosition;
	type: SeaBattleWeaponType;
};

export const SeaBattleWeaponsOffsetMappings: {
	[type in SeaBattleWeaponType]: SeaBattlePosition;
} = {
	bullet1: { x: 12, y: 16 },
	bullet2: { x: 12, y: 16 },
	bullet3: { x: 12, y: 16 },
	mine: { x: 12, y: 12 }
};

export type SeaBattleWeaponsSet = {
	[type in SeaBattleWeaponType]: number;
};

// ------------------------------------------------------------------

export type SeaBattleMapStatus = "ok" | "ko";

export type SeaBattleMapData = {
	fleet: SeaBattleBoatData[];
	hits: SeaBattleHitData[];
	opponentsWeapons: SeaBattleWeaponData[]; // Weapons placed by opponents
	status: SeaBattleMapStatus;
	userId: string;
	weapons: SeaBattleWeaponsSet;
};

// ------------------------------------------------------------------

export type SeaBattleData = {
	currentMapIndex: number;
	maps: SeaBattleMapData[];
};

// ------------------------------------------------------------------

export const extractOpponentMaps = (
	maps: ReadonlyArray<SeaBattleMapData>,
	userId: string
) => Object.values(maps).filter(other => other.userId !== userId);

// ------------------------------------------------------------------

export const extractBattleInfo = ({
	battle,
	userId,
	boatIndex
}: {
	battle: SeaBattleData | null;
	userId: string;
	boatIndex: number;
}): {
	boat?: SeaBattleBoatData;
	currentMapIndex: number;
	opponentMaps?: ReadonlyArray<SeaBattleMapData>;
	playerMap?: SeaBattleMapData;
	playerMapIndex: number;
} => {
	let boat: SeaBattleBoatData | undefined = void 0;
	let currentMapIndex = -1;
	let opponentMaps: SeaBattleMapData[] | undefined = void 0;
	let playerMap: SeaBattleMapData | undefined = void 0;
	let playerMapIndex = -1;
	if (battle) {
		if (userId) {
			currentMapIndex = battle.currentMapIndex;
			playerMapIndex = battle.maps.findIndex(
				other => other.userId === userId
			);
			if (playerMapIndex >= 0) {
				playerMap = battle.maps[playerMapIndex];
				if (boatIndex >= 0 && boatIndex < playerMap.fleet.length) {
					boat = playerMap.fleet[boatIndex];
				}
			}
		}
		opponentMaps = extractOpponentMaps(battle.maps, userId);
	}
	return {
		boat,
		currentMapIndex,
		opponentMaps,
		playerMap,
		playerMapIndex
	};
};

// ------------------------------------------------------------------

export const checkUserTurn = (battle: SeaBattleData, userId: string) =>
	battle.maps[battle.currentMapIndex]?.userId === userId;

export const passUserTurn = (battle: SeaBattleData) => {
	battle.currentMapIndex = (battle.currentMapIndex + 1) % battle.maps.length;
};
