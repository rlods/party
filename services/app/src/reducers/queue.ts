import { Reducer } from "redux";
import { QueueAction } from "../actions/queue";

// ------------------------------------------------------------------

export type State = {
  position: number;
  trackIds: string[];
};

export const INITIAL_STATE: State = {
  position: -1,
  trackIds: []
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
        position: action.payload.position,
        trackIds: action.payload.trackIds
      };
    default:
      return state;
  }
};
