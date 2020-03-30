import { Reducer } from "redux";
import { AxiosError } from "axios";
import { TracksAction } from "../actions/tracks";
import { Tracks } from "../utils/tracks";

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  tracks: Tracks;
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  tracks: {}
};

export const tracksReducer: Reducer<State, TracksAction> = (
  state = INITIAL_STATE,
  action: TracksAction
): State => {
  switch (action.type) {
    case "tracks/FETCHING":
      return {
        ...state,
        fetching: true,
        error: null
      };
    case "tracks/FETCHED": {
      return {
        ...state,
        fetching: false,
        error: null
      };
    }
    case "tracks/ERROR":
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    case "tracks/SET_TRACKS": {
      return {
        ...state,
        tracks: { ...state.tracks, ...action.payload }
      };
    }
    case "tracks/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
