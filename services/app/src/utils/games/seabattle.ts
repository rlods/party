export type SeaBattleAssetPosition = { x: number; y: number };

export type SeaBattleAssetVisibility = "hidden" | "visible";

export type SeaBattleAssetType =
	| OrientedBoatType
	| SeaBattleHitType
	| SeaBattleWeaponType
	| "cell-selection";

export type SeaBattleAssetData = {
	className?: string;
	color?: string;
	onClick?: () => void;
	position: SeaBattleAssetPosition;
	rotate?: string;
	stopPropagation?: boolean;
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
	selected?: boolean;
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

// ------------------------------------------------------------------

export type SeaBattleHitType = "hitted1" | "hitted2" | "missed1" | "missed2";

export type SeaBattleHitData = SeaBattleAssetData & { type: SeaBattleHitType };

// ------------------------------------------------------------------

export type SeaBattleWeaponType = "bullet1" | "bullet2" | "bullet3" | "mine";

export type SeaBattleWeaponData = SeaBattleAssetData & {
	type: SeaBattleWeaponType;
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

export const SeabattleBoatTranslationMappings: {
	[direction: string]: { [rotation: string]: { x: number; y: number } };
} = {
	N: {
		"move-forward": { x: 0, y: -40 },
		"move-backward": { x: 0, y: 40 }
	},
	E: {
		"move-forward": { x: 40, y: 0 },
		"move-backward": { x: -40, y: 0 }
	},
	S: {
		"move-forward": { x: 0, y: 40 },
		"move-backward": { x: 0, y: -40 }
	},
	W: {
		"move-forward": { x: -40, y: 0 },
		"move-backward": { x: 40, y: 0 }
	}
};
