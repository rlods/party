import { Reducer } from "redux";
import { AxiosError } from "axios";
import { RoomsAction } from "../actions/rooms";
import { Rooms } from "../utils/rooms";

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  room_id: string;
  rooms: Rooms;
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  room_id: "",
  rooms: {}
};

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
    case "rooms/SET_ROOM": {
      return {
        ...state,
        room_id: action.payload
      };
    }
    case "rooms/SET_ROOMS": {
      return {
        ...state,
        rooms: { ...state.rooms, ...action.payload }
      };
    }
    case "rooms/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
