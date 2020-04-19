import { decode } from "../../encoder";
import { SeaBattleBoatLengthMappings } from "./mappings";

// ------------------------------------------------------------------

export const GRID_CELL_COUNT = 10;
export const GRID_CELL_UNIT_SIZE = 40;
export const MAX_PLAYER_COUNT = 2;

// ------------------------------------------------------------------

export type SeaBattleAssetPosition = { x: number; y: number };

export type SeaBattleAssetVisibility = "hidden" | "visible";

export type SeaBattleCellType =
	| "cell-crossed"
	| "cell-selected"
	| "cell-selection";

export type SeaBattleAssetType =
	| OrientedBoatType
	| SeaBattleCellType
	| SeaBattleHitType
	| SeaBattleWeaponType;

export type SeaBattleAssetData = {
	position: SeaBattleAssetPosition;
};

// ------------------------------------------------------------------

export type SeaBattleDirection = "N" | "E" | "S" | "W";

export type SeaBattleMovementType =
	| "move-forward"
	| "move-backward"
	| "rotate-left"
	| "rotate-right";

export type SeaBattleBoatStatus = "ok" | "ko";

export type SeaBattleBoatType = "boat1" | "boat2" | "boat3";

export type SeaBattleBoatData = SeaBattleAssetData & {
	direction: SeaBattleDirection;
	status: SeaBattleBoatStatus;
	type: SeaBattleBoatType;
};

export type OrientedBoatType =
	| "boat1-N"
	| "boat1-E"
	| "boat1-S"
	| "boat1-W"
	| "boat2-N"
	| "boat2-E"
	| "boat2-S"
	| "boat2-W"
	| "boat3-N"
	| "boat3-E"
	| "boat3-S"
	| "boat3-W";

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

export type SeaBattleWeaponData = SeaBattleAssetData & {
	count: number;
	type: SeaBattleWeaponType;
};

export const WeaponsOffsetMappings = {
	bullet1: { x: 12, y: 16 },
	bullet2: { x: 12, y: 16 },
	bullet3: { x: 12, y: 16 },
	mine: { x: 12, y: 12 }
};

// ------------------------------------------------------------------

export type SeaBattlePlayerData = {
	fleet: SeaBattleBoatData[];
	hits: SeaBattleHitData[];
	weapons: SeaBattleWeaponData[];
};

// ------------------------------------------------------------------

export type SeaBattleData = {
	players: { [id: string]: SeaBattlePlayerData };
};

// ------------------------------------------------------------------

const checkPositionInGrid = (
	grid: number[][],
	position: SeaBattleAssetPosition
) => grid[position.y][position.x] === 0;

const checkPositionInZone = (position: SeaBattleAssetPosition) =>
	position.x >= 0 &&
	position.x < GRID_CELL_COUNT &&
	position.y >= 0 &&
	position.y < GRID_CELL_COUNT;

const checkZone = (
	boat: SeaBattleBoatData,
	newPosition: SeaBattleAssetPosition,
	newDirection: SeaBattleDirection
) => {
	if (!checkPositionInZone(newPosition)) {
		return false;
	}
	const offset = SeaBattleBoatLengthMappings[boat.type] - 1;
	switch (newDirection) {
		case "N":
			return checkPositionInZone({
				x: newPosition.x,
				y: newPosition.y - offset
			});
		case "E":
			return checkPositionInZone({
				x: newPosition.x + offset,
				y: newPosition.y
			});
		case "S":
			return checkPositionInZone({
				x: newPosition.x,
				y: newPosition.y + offset
			});
		case "W":
			return checkPositionInZone({
				x: newPosition.x - offset,
				y: newPosition.y
			});
	}
};

const checkCollisions = (
	fleet: SeaBattleBoatData[],
	movingBoat: SeaBattleBoatData,
	newPosition: SeaBattleAssetPosition,
	newDirection: SeaBattleDirection
) => {
	const grid = Array<number>(GRID_CELL_COUNT)
		.fill(0)
		.map(_ => Array<number>(GRID_CELL_COUNT).fill(0));
	for (
		let boatIndex = 0, boatCount = fleet.length;
		boatIndex < boatCount;
		++boatIndex
	) {
		const boat = fleet[boatIndex];
		if (movingBoat === boat) {
			continue; // Ignore moving boat
		}
		switch (boat.direction) {
			case "N":
				for (
					let i = 0;
					i < SeaBattleBoatLengthMappings[boat.type];
					++i
				) {
					grid[boat.position.y - i][boat.position.x] += 1;
				}
				break;
			case "E":
				for (
					let i = 0;
					i < SeaBattleBoatLengthMappings[boat.type];
					++i
				) {
					grid[boat.position.y][boat.position.x + i] += 1;
				}
				break;
			case "S":
				for (
					let i = 0;
					i < SeaBattleBoatLengthMappings[boat.type];
					++i
				) {
					grid[boat.position.y + i][boat.position.x] += 1;
				}
				break;
			case "W":
				for (
					let i = 0;
					i < SeaBattleBoatLengthMappings[boat.type];
					++i
				) {
					grid[boat.position.y][boat.position.x - i] += 1;
				}
				break;
		}
	}

	// console.debug("[Seabattle] Collision grid", grid);

	if (!checkPositionInGrid(grid, newPosition)) {
		return false;
	}
	switch (newDirection) {
		case "N":
			for (
				let i = 0;
				i < SeaBattleBoatLengthMappings[movingBoat.type];
				++i
			) {
				if (
					!checkPositionInGrid(grid, {
						x: newPosition.x,
						y: newPosition.y - i
					})
				) {
					return false;
				}
			}
			break;
		case "E":
			for (
				let i = 0;
				i < SeaBattleBoatLengthMappings[movingBoat.type];
				++i
			) {
				if (
					!checkPositionInGrid(grid, {
						x: newPosition.x + i,
						y: newPosition.y
					})
				) {
					return false;
				}
			}
			break;
		case "S":
			for (
				let i = 0;
				i < SeaBattleBoatLengthMappings[movingBoat.type];
				++i
			) {
				if (
					!checkPositionInGrid(grid, {
						x: newPosition.x,
						y: newPosition.y + i
					})
				) {
					return false;
				}
			}
			break;
		case "W":
			for (
				let i = 0;
				i < SeaBattleBoatLengthMappings[movingBoat.type];
				++i
			) {
				if (
					!checkPositionInGrid(grid, {
						x: newPosition.x - i,
						y: newPosition.y
					})
				) {
					return false;
				}
			}
			break;
	}
	return true;
};

export const movementIsPossible = (
	fleet: SeaBattleBoatData[],
	movingBoatIndex: number,
	newPosition: SeaBattleAssetPosition,
	newDirection: SeaBattleDirection
) => {
	const movingBoat = fleet[movingBoatIndex];
	if (!checkZone(movingBoat, newPosition, newDirection)) {
		console.debug("[Seabattle] Boat blocked by zone");
		return false;
	}
	if (!checkCollisions(fleet, movingBoat, newPosition, newDirection)) {
		console.debug("[Seabattle] Boat blocked by collision");
		return false;
	}
	return true;
};

export const generateBattle = (userId: string): SeaBattleData => {
	console.debug("[SeaBattle] Genering battle...");
	const battle: SeaBattleData = {
		players: {}
	};
	generateFleet(battle, userId);
	return battle;
};

export const generateFleet = (battle: SeaBattleData, userId: string) => {
	console.debug("[SeaBattle] Genering fleet...", {
		userId
	});
	battle.players[userId] = {
		fleet: [
			{
				type: "boat1",
				direction: "E",
				position: { x: 0, y: 0 },
				status: "ok"
			},
			{
				type: "boat1",
				direction: "E",
				position: { x: 1, y: 0 },
				status: "ko"
			},
			{
				type: "boat2",
				direction: "E",
				position: { x: 0, y: 1 },
				status: "ok"
			},
			{
				type: "boat2",
				direction: "E",
				position: { x: 2, y: 1 },
				status: "ko"
			},
			{
				type: "boat3",
				direction: "E",
				position: { x: 0, y: 2 },
				status: "ok"
			},
			{
				type: "boat3",
				direction: "E",
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
		weapons: [{ count: 1, position: { x: 0, y: 5 }, type: "mine" }]
	};
};

// ------------------------------------------------------------------

export const extractBattleInfo = (
	extra: string,
	userId: string,
	boatIndex: number,
	opponentIndex: number
): {
	battle?: SeaBattleData;
	boat?: SeaBattleBoatData;
	opponent?: SeaBattlePlayerData;
	opponents?: SeaBattlePlayerData[];
	player?: SeaBattlePlayerData;
} => {
	let battle: SeaBattleData | undefined = void 0;
	let boat: SeaBattleBoatData | undefined = void 0;
	let opponent: SeaBattlePlayerData | undefined = void 0;
	let opponents: SeaBattlePlayerData[] | undefined = void 0;
	let player: SeaBattlePlayerData | undefined = void 0;
	if (extra) {
		battle = decode<SeaBattleData>(extra);
		if (userId) {
			player = battle.players[userId];
			if (boatIndex >= 0 && boatIndex < player.fleet.length) {
				boat = player.fleet[boatIndex];
			}
		}
		opponents = Object.values(battle.players).filter(
			other => other !== player
		);
		if (opponentIndex >= 0 && opponentIndex < opponents.length) {
			opponent = opponents[opponentIndex];
		}
	}
	return {
		battle,
		boat,
		opponent,
		opponents,
		player
	};
};
