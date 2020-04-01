import { Reducer } from "redux";
import { PlayerAction } from "../actions/player";

// ------------------------------------------------------------------

export type State = {
  playing: boolean;
};

export const INITIAL_STATE: State = {
  playing: false
};

export const playerReducer: Reducer<State, PlayerAction> = (
  state = INITIAL_STATE,
  action
): State => {
  switch (action.type) {
    case "player/START":
      return { ...state, playing: true };
    case "player/STOP":
      return { ...state, playing: false };
    case "player/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
