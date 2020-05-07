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

type RoomData = {
	access: RoomAccess;
	color: CombinedColor;
	extra: string;
	extraDecoded: any;
	firebaseRoom: ReturnType<typeof FirebaseRoom> | null;
	info: RoomInfo | null;
	medias: ReadonlyArray<MediaAccess>;
	queue: RoomQueue | null;
	tracks: ReadonlyArray<ContextualizedTrackAccess>;
};

export type State = Readonly<{
	data: RoomData;
	error: null | string;
	fetching: boolean;
}>;

export const INITIAL_STATE: State = {
	data: {
		access: { dbId: "", roomId: "", secret: "" },
		color: { fg: "dark", bg: { r: 255, g: 255, b: 255 } },
		extra: "",
		extraDecoded: null,
		firebaseRoom: null,
		info: null,
		medias: [],
		queue: null,
		tracks: []
	},
	error: null,
	fetching: false
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
				data: {
					...state.data,
					...action.payload
				},
				fetching: false,
				error: null
			};
		case "room/RESET":
			return INITIAL_STATE;
		default:
			return state;
	}
};
