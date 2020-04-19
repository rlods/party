import { SeaBattleBoatLengthMappings } from "./mappings";
import {
	SeaBattleBoatData,
	SeaBattleGrid,
	SeaBattlePosition,
	SeaBattleDirection,
	GRID_CELL_COUNT
} from ".";

// ------------------------------------------------------------------

export const checkPositionInGrid = (
	grid: SeaBattleGrid,
	position: SeaBattlePosition
) => grid[position.y][position.x] === 0;

// ------------------------------------------------------------------

export const checkPositionInZone = (position: SeaBattlePosition) =>
	position.x >= 0 &&
	position.x < GRID_CELL_COUNT &&
	position.y >= 0 &&
	position.y < GRID_CELL_COUNT;

// ------------------------------------------------------------------

export const checkZone = (
	boat: SeaBattleBoatData,
	newPosition: SeaBattlePosition,
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
	return grid;
};

// ------------------------------------------------------------------

export const checkCollisions = (
	fleet: SeaBattleBoatData[],
	movingBoat: SeaBattleBoatData,
	newPosition: SeaBattlePosition,
	newDirection: SeaBattleDirection
) => {
	const grid = generateGrid(fleet, movingBoat);
	// console.debug("[SeaBattle] Collision grid", grid);
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

// ------------------------------------------------------------------

export const movementIsPossible = (
	fleet: SeaBattleBoatData[],
	movingBoatIndex: number,
	newPosition: SeaBattlePosition,
	newDirection: SeaBattleDirection
) => {
	const movingBoat = fleet[movingBoatIndex];
	if (!checkZone(movingBoat, newPosition, newDirection)) {
		console.debug("[SeaBattle] Boat blocked by zone");
		return false;
	}
	if (!checkCollisions(fleet, movingBoat, newPosition, newDirection)) {
		console.debug("[SeaBattle] Boat blocked by collision");
		return false;
	}
	return true;
};
