import { SeaBattlePosition, SeaBattleMovementType } from ".";
import { KEY_RIGHT, KEY_LEFT, KEY_DOWN, KEY_UP } from "../../keyboards";

// ------------------------------------------------------------------

export const SeaBattleBoatRotationTransformationMappings: {
	[type: string]: {
		[direction: string]: SeaBattlePosition;
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

// ------------------------------------------------------------------

export const SeaBattleKeyboardMoveMappings: {
	[direction: string]: { [key: string]: SeaBattleMovementType };
} = {
	N: {
		[KEY_UP]: "move-forward",
		[KEY_DOWN]: "move-backward",
		[KEY_LEFT]: "rotate-left",
		[KEY_RIGHT]: "rotate-right"
	},
	E: {
		[KEY_UP]: "rotate-left",
		[KEY_DOWN]: "rotate-right",
		[KEY_LEFT]: "move-backward",
		[KEY_RIGHT]: "move-forward"
	},
	S: {
		[KEY_UP]: "move-backward",
		[KEY_DOWN]: "move-forward",
		[KEY_LEFT]: "rotate-right",
		[KEY_RIGHT]: "rotate-left"
	},
	W: {
		[KEY_UP]: "rotate-right",
		[KEY_DOWN]: "rotate-left",
		[KEY_LEFT]: "move-forward",
		[KEY_RIGHT]: "move-backward"
	}
};

// ------------------------------------------------------------------

export const SeaBattleBoatTranslationMappings: {
	[direction: string]: { [rotation: string]: SeaBattlePosition };
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

// ------------------------------------------------------------------

export const SeaBattleBoatLengthMappings = {
	boat1: 1,
	boat2: 2,
	boat3: 3
};

// ------------------------------------------------------------------

export const SeaBattleMovementIconMappings = {
	N: {
		forward: "arrow-up",
		backward: "arrow-down"
	},
	E: {
		forward: "arrow-right",
		backward: "arrow-left"
	},
	S: {
		forward: "arrow-down",
		backward: "arrow-up"
	},
	W: {
		forward: "arrow-left",
		backward: "arrow-right"
	}
};
