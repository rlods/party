import { Reducer } from "redux";
import { AxiosError } from "axios";
import { RoomAction } from "../actions/room";
import { RoomAccess, RoomInfo } from "../utils/rooms";
import { CombinedColor } from "../utils/colorpicker";
import { FirebaseRoom } from "../utils/firebase";
import { MediaAccess } from "../utils/medias";

// ------------------------------------------------------------------

export type RoomData = {
  room: ReturnType<typeof FirebaseRoom> | null;
  access: RoomAccess;
  color: CombinedColor;
  info: RoomInfo | null;
  medias: MediaAccess[];
  playing: boolean;
  position: number;
};

export type State = RoomData & {
  fetching: boolean;
  error: null | AxiosError;
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  room: null,
  access: { id: "", secret: "" },
  color: { fg: { r: 0, g: 0, b: 0 }, bg: { r: 255, g: 255, b: 255 } },
  info: null,
  medias: [],
  playing: false,
  position: 0,
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
        error: null,
      };
    case "room/FETCHED": {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case "room/ERROR":
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    case "room/SET": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "room/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
