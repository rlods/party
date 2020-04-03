import { Reducer } from "redux";
import { PlayerAction } from "../actions/player";

// ------------------------------------------------------------------

export type State = {
  playing: boolean;
  position: number;
};

export const INITIAL_STATE: State = {
  playing: false,
  position: 0
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
    case "player/SET_POSITION":
      return { ...state, position: action.payload };
    case "player/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
