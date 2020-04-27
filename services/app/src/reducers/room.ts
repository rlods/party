import { Reducer } from "redux";
import { RoomAccess, RoomInfo, RoomQueue } from "../utils/rooms";
import { CombinedColor } from "../utils/colorpicker";
import { FirebaseRoom } from "../utils/firebase/room";
import { ContextualizedTrackAccess, MediaAccess } from "../utils/medias";
import { createAction } from "../actions";

// ------------------------------------------------------------------

type RoomAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof error>
	| ReturnType<typeof resetRoom>
	| ReturnType<typeof setRoom>;

export const fetching = () => createAction("room/FETCHING");
export const error = (error: string) => createAction("room/ERROR", error);
export const resetRoom = () => createAction("room/RESET");
export const setRoom = (values: Partial<RoomData>) =>
	createAction("room/SET", values);

// ------------------------------------------------------------------

export type RoomData = {
	_fbRoom: ReturnType<typeof FirebaseRoom> | null;
	access: RoomAccess;
	color: CombinedColor;
	extra: string;
	info: RoomInfo | null;
	medias: MediaAccess[];
	queue: RoomQueue | null;
	tracks: Array<ContextualizedTrackAccess>;
};

export type State = RoomData & {
	fetching: boolean;
	error: null | string;
};

const INITIAL_STATE: State = {
	_fbRoom: null,
	access: { dbId: "", roomId: "", secret: "" },
	color: { fg: "dark", bg: { r: 255, g: 255, b: 255 } },
	error: null,
	extra: "",
	fetching: false,
	info: null,
	medias: [],
	queue: null,
	tracks: []
};

// ------------------------------------------------------------------

export const roomReducer: Reducer<State, RoomAction> = (
	state = INITIAL_STATE,
	action: RoomAction
): State => {
	switch (action.type) {
		case "room/FETCHING":
			return {
				...state,
				fetching: true,
				error: null
			};
		case "room/ERROR":
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		case "room/SET":
			return {
				...state,
				...action.payload,
				fetching: false,
				error: null
			};
		case "room/RESET":
			return INITIAL_STATE;
		default:
			return state;
	}
};
