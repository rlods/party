import { Reducer } from "redux";
import { QueueAction } from "../actions/queue";

// ------------------------------------------------------------------

export type State = {
  playing: boolean;
  position: number;
  trackIds: string[];
};

export const INITIAL_STATE: State = {
  playing: false,
  position: 0,
  trackIds: [],
};

// ------------------------------------------------------------------

export const queueReducer: Reducer<State, QueueAction> = (
  state = INITIAL_STATE,
  action
): State => {
  switch (action.type) {
    case "queue/SET":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
