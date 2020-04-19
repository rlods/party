import { Reducer } from "redux";
import { AxiosError } from "axios";
import { RoomAccess, RoomInfo } from "../utils/rooms";
import { CombinedColor } from "../utils/colorpicker";
import { FirebaseRoom } from "../utils/firebase";
import { ContextualizedTrackAccess, MediaAccess } from "../utils/medias";
import { createAction } from "../actions";

// ------------------------------------------------------------------

type RoomAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof error>
	| ReturnType<typeof resetRoom>
	| ReturnType<typeof setRoom>;

export const fetching = () => createAction("room/FETCHING");
export const error = (error: AxiosError) => createAction("room/ERROR", error);
export const resetRoom = () => createAction("room/RESET");
export const setRoom = (values: Partial<RoomData>) =>
	createAction("room/SET", values);

// ------------------------------------------------------------------

export type RoomData = {
	access: RoomAccess;
	color: CombinedColor;
	info: RoomInfo | null;
	medias: MediaAccess[];
	room: ReturnType<typeof FirebaseRoom> | null;
	tracks: Array<ContextualizedTrackAccess>; // TODO expanded medias (containers are replaced by their tracks)
};

export type State = RoomData & {
	fetching: boolean;
	error: null | AxiosError;
};

const INITIAL_STATE: State = {
	access: { id: "", secret: "" },
	color: { fg: "dark", bg: { r: 255, g: 255, b: 255 } },
	error: null,
	fetching: false,
	info: null,
	medias: [],
	room: null,
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
