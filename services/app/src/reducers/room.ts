import { Reducer } from "redux";
import { RoomAccess, RoomInfo, RoomQueue, RoomPlayer } from "../utils/rooms";
import { CombinedColor } from "../utils/colorpicker";
import { FirebaseRoom } from "../utils/firebase/room";
import { ContextualizedTrackAccess, MediaAccess } from "../utils/medias";
import { createAction } from "../actions";

// ------------------------------------------------------------------

type RoomAction =
	| ReturnType<typeof fetchingRoom>
	| ReturnType<typeof resetRoom>
	| ReturnType<typeof setRoomAccess>
	| ReturnType<typeof setRoomData>
	| ReturnType<typeof setRoomError>;

export const fetchingRoom = () => createAction("room/FETCHING");
export const resetRoom = () => createAction("room/RESET");
export const setRoomAccess = (access: RoomAccess) =>
	createAction("room/SET_ACCESS", access);
export const setRoomData = (values: Partial<RoomData>) =>
	createAction("room/SET_DATA", values);
export const setRoomError = (error: string) =>
	createAction("room/ERROR", error);

// ------------------------------------------------------------------

type RoomData = {
	color: CombinedColor;
	extra: string;
	extraDecoded: any;
	firebaseRoom: ReturnType<typeof FirebaseRoom> | null;
	info: RoomInfo | null;
	medias: ReadonlyArray<MediaAccess>;
	player: RoomPlayer;
	queue: RoomQueue;
	tracks: ReadonlyArray<ContextualizedTrackAccess>;
};

export type State = Readonly<{
	access: RoomAccess;
	data: RoomData;
	error: null | string;
	fetching: boolean;
}>;

export const INITIAL_STATE: State = {
	access: { dbId: "", roomId: "", secret: "" },
	data: {
		color: { fg: "dark", bg: { r: 255, g: 255, b: 255 } },
		extra: "",
		extraDecoded: null,
		firebaseRoom: null,
		info: null,
		medias: [],
		player: {
			mode: "default",
			playing: false,
			position: 0
		},
		queue: {},
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
		case "room/SET_ACCESS":
			return {
				...state,
				access: action.payload,
				fetching: false,
				error: null
			};
		case "room/SET_DATA":
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
