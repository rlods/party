import {
	SeaBattlePosition,
	SeaBattleMovementType,
	SeaBattleBoatType,
	SeaBattleDirection,
	SeaBattleTranslationType
} from ".";
import { KEY_RIGHT, KEY_LEFT, KEY_DOWN, KEY_UP } from "../../keyboards";

// ------------------------------------------------------------------

export const SeaBattleBoatRotationTransformationMappings: {
	[type in SeaBattleBoatType]: {
		[direction in SeaBattleDirection]: SeaBattlePosition;
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
	[direction in SeaBattleDirection]: { [key: string]: SeaBattleMovementType };
} = {
	N: {
		[KEY_UP]: "move_forward",
		[KEY_DOWN]: "move_backward",
		[KEY_LEFT]: "rotate_left",
		[KEY_RIGHT]: "rotate_right"
	},
	E: {
		[KEY_UP]: "rotate_left",
		[KEY_DOWN]: "rotate_right",
		[KEY_LEFT]: "move_backward",
		[KEY_RIGHT]: "move_forward"
	},
	S: {
		[KEY_UP]: "move_backward",
		[KEY_DOWN]: "move_forward",
		[KEY_LEFT]: "rotate_right",
		[KEY_RIGHT]: "rotate_left"
	},
	W: {
		[KEY_UP]: "rotate_right",
		[KEY_DOWN]: "rotate_left",
		[KEY_LEFT]: "move_forward",
		[KEY_RIGHT]: "move_backward"
	}
};

// ------------------------------------------------------------------

export const SeaBattleBoatTranslationMappings: {
	[direction in SeaBattleDirection]: {
		[translation in SeaBattleTranslationType]: SeaBattlePosition;
	};
} = {
	N: {
		move_forward: { x: 0, y: -1 },
		move_backward: { x: 0, y: 1 }
	},
	E: {
		move_forward: { x: 1, y: 0 },
		move_backward: { x: -1, y: 0 }
	},
	S: {
		move_forward: { x: 0, y: 1 },
		move_backward: { x: 0, y: -1 }
	},
	W: {
		move_forward: { x: -1, y: 0 },
		move_backward: { x: 1, y: 0 }
	}
};

// ------------------------------------------------------------------

export const SeaBattleBoatLengthMappings: {
	[type in SeaBattleBoatType]: number;
} = {
	boat1: 1,
	boat2: 2,
	boat3: 3
};

// ------------------------------------------------------------------

export const SeaBattleMovementIconMappings: {
	[direction in SeaBattleDirection]: {
		[translation in SeaBattleTranslationType]: string;
	};
} = {
	N: {
		move_forward: "arrow-up",
		move_backward: "arrow-down"
	},
	E: {
		move_forward: "arrow-right",
		move_backward: "arrow-left"
	},
	S: {
		move_forward: "arrow-down",
		move_backward: "arrow-up"
	},
	W: {
		move_forward: "arrow-left",
		move_backward: "arrow-right"
	}
};
