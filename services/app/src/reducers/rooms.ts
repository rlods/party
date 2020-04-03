import { Reducer } from "redux";
import { AxiosError } from "axios";
import { RoomsAction } from "../actions/rooms";
import { Rooms, saveRoomAccess, RoomAccess } from "../utils/rooms";
import { CombinedColor } from "../utils/colorpicker";

// ------------------------------------------------------------------

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  room_access: RoomAccess;
  room_color: CombinedColor;
  rooms: Rooms;
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  room_access: { id: "", secret: "" },
  room_color: { fg: { r: 0, g: 0, b: 0 }, bg: { r: 255, g: 255, b: 255 } },
  rooms: {}
};

// ------------------------------------------------------------------

export const roomsReducer: Reducer<State, RoomsAction> = (
  state = INITIAL_STATE,
  action: RoomsAction
): State => {
  switch (action.type) {
    case "rooms/FETCHING":
      return {
        ...state,
        fetching: true,
        error: null
      };
    case "rooms/FETCHED": {
      return {
        ...state,
        fetching: false,
        error: null
      };
    }
    case "rooms/ERROR":
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    case "rooms/SET_ROOM_ACCESS": {
      saveRoomAccess(action.payload);
      return {
        ...state,
        room_access: action.payload
      };
    }
    case "rooms/SET_ROOMS": {
      return {
        ...state,
        rooms: { ...state.rooms, ...action.payload }
      };
    }
    case "rooms/SET_ROOM_COLOR": {
      return {
        ...state,
        room_color: action.payload
      };
    }
    case "rooms/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
