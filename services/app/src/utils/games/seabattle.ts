export const GRID_CELL_COUNT = 10;
export const GRID_CELL_UNIT_SIZE = 40;

// ------------------------------------------------------------------

export type SeaBattleAssetPosition = { x: number; y: number };

export type SeaBattleAssetVisibility = "hidden" | "visible";

export type SeaBattleAssetType =
	| OrientedBoatType
	| SeaBattleHitType
	| SeaBattleWeaponType
	| "cell-selection";

export type SeaBattleAssetData = {
	color?: string;
	position: SeaBattleAssetPosition;
	rotate?: string;
	visibility?: SeaBattleAssetVisibility;
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
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

export const SeabattleBoatOrientationMappings: {
	[type: string]: { [direction: string]: OrientedBoatType };
} = {
	boat1: {
		N: "boat1-N",
		E: "boat1-E",
		S: "boat1-S",
		W: "boat1-W"
	},
	boat2: {
		N: "boat2-N",
		E: "boat2-E",
		S: "boat2-S",
		W: "boat2-W"
	},
	boat3: {
		N: "boat3-N",
		E: "boat3-E",
		S: "boat3-S",
		W: "boat3-W"
	}
};

export const SeabattleBoatRotationMappings: {
	[direction: string]: { [rotation: string]: SeaBattleDirection };
} = {
	N: {
		"rotate-left": "W",
		"rotate-right": "E"
	},
	E: {
		"rotate-left": "N",
		"rotate-right": "S"
	},
	S: {
		"rotate-left": "E",
		"rotate-right": "W"
	},
	W: {
		"rotate-left": "S",
		"rotate-right": "N"
	}
};

export const SeabattleBoatRotationTransformationMappings: {
	[type: string]: {
		[direction: string]: SeaBattleAssetPosition;
	};
} = {
	boat1: {
		N: { x: 0, y: 0 },
		E: { x: 0, y: 0 },
		S: { x: 0, y: 0 },
		W: { x: 0, y: 0 }
	},
	boat2: {
		N: { x: 0, y: -1 },
		E: { x: 1, y: 0 },
		S: { x: 0, y: 1 },
		W: { x: -1, y: 0 }
	},
	boat3: {
		N: { x: 0, y: -2 },
		E: { x: 2, y: 0 },
		S: { x: 0, y: 2 },
		W: { x: -2, y: 0 }
	}
};

export const SeabattleBoatTranslationMappings: {
	[direction: string]: { [rotation: string]: SeaBattleAssetPosition };
} = {
	N: {
		"move-forward": { x: 0, y: -1 },
		"move-backward": { x: 0, y: 1 }
	},
	E: {
		"move-forward": { x: 1, y: 0 },
		"move-backward": { x: -1, y: 0 }
	},
	S: {
		"move-forward": { x: 0, y: 1 },
		"move-backward": { x: 0, y: -1 }
	},
	W: {
		"move-forward": { x: -1, y: 0 },
		"move-backward": { x: 1, y: 0 }
	}
};

const SeaBattleBoatLengthMappings = {
	boat1: 1,
	boat2: 2,
	boat3: 3
};

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------
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
	const offset = SeaBattleBoatLengthMappings[movingBoat.type] - 1;
	switch (newDirection) {
		case "N":
			return checkPositionInGrid(grid, {
				x: newPosition.x,
				y: newPosition.y - offset
			});
		case "E":
			return checkPositionInGrid(grid, {
				x: newPosition.x + offset,
				y: newPosition.y
			});
		case "S":
			return checkPositionInGrid(grid, {
				x: newPosition.x,
				y: newPosition.y + offset
			});
		case "W":
			return checkPositionInGrid(grid, {
				x: newPosition.x - offset,
				y: newPosition.y
			});
	}
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
