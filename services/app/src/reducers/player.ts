import { Reducer } from "redux";
import { PlayerAction } from "../actions/player";

// ------------------------------------------------------------------

export type State = {
  playing: boolean;
  track_percent: number;
};

export const INITIAL_STATE: State = {
  playing: false,
  track_percent: 0
};

// ------------------------------------------------------------------

export const playerReducer: Reducer<State, PlayerAction> = (
  state = INITIAL_STATE,
  action
): State => {
  switch (action.type) {
    case "player/START":
      return { ...state, playing: true };
    case "player/STOP":
      return { ...state, playing: false };
    case "player/SET_TRACK_PERCENT":
      return { ...state, track_percent: action.payload };
    case "player/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
