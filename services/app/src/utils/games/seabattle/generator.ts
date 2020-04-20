import {
	SeaBattleBoatData,
	SeaBattleBoatType,
	SeaBattleData,
	SeaBattleDirections,
	SeaBattleMapData,
	SeaBattleWeaponsSet,
	GRID_CELL_COUNT,
	DirectionToAngle,
	SeaBattlePosition,
	SeaBattleDirection
} from ".";
import { SeaBattleBoatLengthMappings } from "./mappings";

// ------------------------------------------------------------------

const FleetDefaultSet = {
	// Keys are boat types
	boat1: 4,
	boat2: 3,
	boat3: 2
};

// ------------------------------------------------------------------

export const generateWeaponsSet = (): SeaBattleWeaponsSet => ({
	// Keys are weapon types: Following counts are abitrary choices (to validate or adjust ^_^) - TODO
	bullet1: 100,
	bullet2: 6,
	bullet3: 3,
	mine: 3
});

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

// ------------------------------------------------------------------

const getCell = (grid: number[][], x: number, y: number): number => {
	if (x < 0 || x >= GRID_CELL_COUNT || y < 0 || y >= GRID_CELL_COUNT) {
		return -1;
	}
	return grid[y][x];
};

const setCell = (grid: number[][], x: number, y: number) => {
	grid[y][x] = 1;
};

export const checkAvailable = (
	grid: number[][],
	pos: SeaBattlePosition,
	dir: SeaBattleDirection,
	boatLength: number
) => {
	switch (dir) {
		case "N":
			for (let i = 0; i < boatLength; ++i) {
				const cell = getCell(grid, pos.x, pos.y - i);
				if (0 !== cell) {
					return false;
				}
			}
			break;
		case "E":
			for (let i = 0; i < boatLength; ++i) {
				const cell = getCell(grid, pos.x + i, pos.y);
				if (0 !== cell) {
					return false;
				}
			}
			break;
		case "S":
			for (let i = 0; i < boatLength; ++i) {
				const cell = getCell(grid, pos.x, pos.y + i);
				if (0 !== cell) {
					return false;
				}
			}
			break;
		case "W":
			for (let i = 0; i < boatLength; ++i) {
				const cell = getCell(grid, pos.x - i, pos.y);
				if (0 !== cell) {
					return false;
				}
			}
			break;
	}
	return true;
};

export const generatePlace = (grid: number[][], boatLength: number) => {
	while (true) {
		const pos = {
			x: Math.floor(Math.random() * GRID_CELL_COUNT),
			y: Math.floor(Math.random() * GRID_CELL_COUNT)
		};
		const dir =
			SeaBattleDirections[
				Math.floor(Math.random() * SeaBattleDirections.length)
			];
		if (checkAvailable(grid, pos, dir, boatLength)) {
			switch (dir) {
				case "N":
					for (let i = 0; i < boatLength; ++i) {
						setCell(grid, pos.x, pos.y - i);
					}
					break;
				case "E":
					for (let i = 0; i < boatLength; ++i) {
						setCell(grid, pos.x + i, pos.y);
					}
					break;
				case "S":
					for (let i = 0; i < boatLength; ++i) {
						setCell(grid, pos.x, pos.y + i);
					}
					break;
				case "W":
					for (let i = 0; i < boatLength; ++i) {
						setCell(grid, pos.x - i, pos.y);
					}
					break;
			}
			return {
				angle: DirectionToAngle[dir],
				position: pos
			};
		}
	}
};

export const generateFleet = (battle: SeaBattleData, userId: string) => {
	const oldMap = battle.maps.find(other => other.userId === userId);
	if (oldMap) {
		return; // User already has a map in the battle
	}
	console.debug("[SeaBattle] Genering fleet...", {
		userId
	});

	const grid: number[][] = Array<number>(GRID_CELL_COUNT)
		.fill(0)
		.map(_ => Array<number>(GRID_CELL_COUNT).fill(0));

	const fleet: SeaBattleBoatData[] = [];
	for (const boatSetting of Object.entries(FleetDefaultSet).reverse()) {
		const [rawType, count] = boatSetting;
		const type = rawType as SeaBattleBoatType;
		const boatLength = SeaBattleBoatLengthMappings[type];
		for (let i = 0; i < count; ++i) {
			const { angle, position } = generatePlace(grid, boatLength);
			const boat: SeaBattleBoatData = {
				hits: [],
				type,
				angle,
				position,
				status: "ok"
			};
			fleet.push(boat);
		}
	}

	const newMap: SeaBattleMapData = {
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
		status: "ok",
		userId,
		weapons: generateWeaponsSet()
	};
	battle.maps.push(newMap);
};
