import { Reducer } from "redux";
import { AxiosError } from "axios";
import { RoomsAction } from "../actions/rooms";
import { Rooms } from "../utils/rooms";

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  items: Rooms;
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  items: {}
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
        error: null,
        items: { ...state.items, ...action.payload }
      };
    }
    case "rooms/ERROR":
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    case "rooms/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
