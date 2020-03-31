import { Reducer } from "redux";
import { QueueAction } from "../actions/queue";

// ------------------------------------------------------------------

export type State = {
  trackIds: string[];
};

export const INITIAL_STATE: State = {
  trackIds: []
};

export const queueReducer: Reducer<State, QueueAction> = (
  state = INITIAL_STATE,
  action
): State => {
  switch (action.type) {
    case "queue/PUSH":
      return { ...state, trackIds: [...state.trackIds, action.payload] };
    case "queue/REMOVE":
      return {
        ...state,
        trackIds: state.trackIds.filter(trackId => trackId !== action.payload)
      };
    case "queue/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
