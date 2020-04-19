import { SeaBattleBoatLengthMappings } from "./mappings";
import {
	SeaBattleBoatData,
	SeaBattleGrid,
	SeaBattlePosition,
	SeaBattleDirection,
	GRID_CELL_COUNT,
	AngleToDirection
} from ".";

// ------------------------------------------------------------------

export const checkPositionInGrid = (
	grid: SeaBattleGrid,
	pos: SeaBattlePosition
) => grid[pos.y][pos.x] === 0;

// ------------------------------------------------------------------

export const checkPositionInZone = (pos: SeaBattlePosition) =>
	pos.x >= 0 &&
	pos.x < GRID_CELL_COUNT &&
	pos.y >= 0 &&
	pos.y < GRID_CELL_COUNT;

// ------------------------------------------------------------------

export const checkZone = (
	boat: SeaBattleBoatData,
	newPos: SeaBattlePosition,
	newDir: SeaBattleDirection
) => {
	if (!checkPositionInZone(newPos)) {
		return false;
	}
	const offset = SeaBattleBoatLengthMappings[boat.type] - 1;
	switch (newDir) {
		case "N":
			return checkPositionInZone({
				x: newPos.x,
				y: newPos.y - offset
			});
		case "E":
			return checkPositionInZone({
				x: newPos.x + offset,
				y: newPos.y
			});
		case "S":
			return checkPositionInZone({
				x: newPos.x,
				y: newPos.y + offset
			});
		case "W":
			return checkPositionInZone({
				x: newPos.x - offset,
				y: newPos.y
			});
	}
};

// ------------------------------------------------------------------

export const generateGrid = (
	fleet: SeaBattleBoatData[],
	movingBoat?: SeaBattleBoatData
): SeaBattleGrid => {
	const grid: SeaBattleGrid = Array<number>(GRID_CELL_COUNT)
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
		switch (AngleToDirection(boat.angle)) {
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
	return grid;
};

// ------------------------------------------------------------------

export const checkCollisions = (
	fleet: SeaBattleBoatData[],
	boat: SeaBattleBoatData,
	newPos: SeaBattlePosition,
	newDir: SeaBattleDirection
) => {
	const grid = generateGrid(fleet, boat);
	// console.debug("[SeaBattle] Collision grid", grid);
	if (!checkPositionInGrid(grid, newPos)) {
		return false;
	}
	const boatLength = SeaBattleBoatLengthMappings[boat.type];
	switch (newDir) {
		case "N":
			for (let i = 0; i < boatLength; ++i) {
				if (
					!checkPositionInGrid(grid, {
						x: newPos.x,
						y: newPos.y - i
					})
				) {
					return false;
				}
			}
			break;
		case "E":
			for (let i = 0; i < boatLength; ++i) {
				if (
					!checkPositionInGrid(grid, {
						x: newPos.x + i,
						y: newPos.y
					})
				) {
					return false;
				}
			}
			break;
		case "S":
			for (let i = 0; i < boatLength; ++i) {
				if (
					!checkPositionInGrid(grid, {
						x: newPos.x,
						y: newPos.y + i
					})
				) {
					return false;
				}
			}
			break;
		case "W":
			for (let i = 0; i < boatLength; ++i) {
				if (
					!checkPositionInGrid(grid, {
						x: newPos.x - i,
						y: newPos.y
					})
				) {
					return false;
				}
			}
			break;
	}
	return true;
};

// ------------------------------------------------------------------

export const movementIsPossible = (
	fleet: SeaBattleBoatData[],
	boat: SeaBattleBoatData,
	newPos: SeaBattlePosition,
	newDir: SeaBattleDirection
) => {
	if (!checkZone(boat, newPos, newDir)) {
		console.debug("[SeaBattle] Boat blocked by zone");
		return false;
	}
	if (!checkCollisions(fleet, boat, newPos, newDir)) {
		console.debug("[SeaBattle] Boat blocked by collision");
		return false;
	}
	return true;
};
