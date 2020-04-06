import { Reducer } from "redux";
import { PlayerAction } from "../actions/player";

// ------------------------------------------------------------------

export type State = {
  playing: boolean;
  track_percent: number;
};

export const INITIAL_STATE: State = {
  playing: false,
  track_percent: 0,
};

// ------------------------------------------------------------------

export const playerReducer: Reducer<State, PlayerAction> = (
  state = INITIAL_STATE,
  action
): State => {
  switch (action.type) {
    case "player/SET":
      return { ...state, ...action.payload };
    case "player/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
