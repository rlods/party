import { decode } from "../../encoder";
import { augmentedArrayIndexAccess } from "../../";

// ------------------------------------------------------------------

export const GRID_CELL_COUNT = 10;
export const GRID_CELL_UNIT_SIZE = 40;
export const MAX_PLAYER_COUNT = 3;
export const INVALID_MOVE_MESSAGE_TAG = "invalid_move";

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

export type SeaBattleMovementType =
	| "move-forward"
	| "move-backward"
	| "rotate-left"
	| "rotate-right";

export type SeaBattleBoatStatus = "ok" | "ko";

export type SeaBattleBoatType = "boat1" | "boat2" | "boat3";

export type SeaBattleBoatData = {
	angle: number;
	hits: SeaBattleHitData[];
	position: SeaBattlePosition;
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

export const HitsOffsetInBoatappings = {
	// Keys are hits types
	hitted: { x: 4, y: 4 },
	missed: { x: 4, y: 4 }
};

export const HitsOffsetInCellMappings = {
	// Keys are hits types
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

const FleetDefaultSet = {
	// Keys are boat types
	boat1: 4,
	boat2: 3,
	boat3: 2
};

export const generateFleet = (battle: SeaBattleData, userId: string) => {
	const oldMap = battle.maps.find(other => other.userId === userId);
	if (oldMap) {
		return; // User already has a map in the battle
	}
	console.debug("[SeaBattle] Genering fleet...", {
		userId
	});

	let totalCount = 0;
	const fleet: SeaBattleBoatData[] = [];
	Object.entries(FleetDefaultSet)
		.reverse()
		.forEach(([type, count]) => {
			for (let i = 0; i < count; ++i) {
				fleet.push({
					hits: [
						/*
						{ position: { x: 0, y: 0 }, type: "hitted" },
						{ position: { x: 1, y: 0 }, type: "hitted" }
						 */
					],
					type: type as SeaBattleBoatType,
					angle: 0,
					position: { x: 0, y: totalCount++ },
					status: "ok"
				});
			}
		});

	battle.maps.push({
		fleet,
		hits: [
			/*
			{ position: { x: 0, y: 1 }, type: "hitted" },
			{ position: { x: 0, y: 2 }, type: "hitted" },
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

export const checkUserHasBatton = (battle: SeaBattleData, userId: string) =>
	battle.maps[battle.currentMapIndex]?.userId === userId;

export const passBatonToNextPlayer = (battle: SeaBattleData) => {
	battle.currentMapIndex = (battle.currentMapIndex + 1) % battle.maps.length;
};
