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
    case "queue/PUSH":
      return { ...state, trackIds: [...state.trackIds, ...action.payload] };
    case "queue/REMOVE":
      const copy = [...state.trackIds];
      copy.splice(action.payload, 1);
      return {
        ...state,
        position:
          action.payload < state.position ? state.position - 1 : state.position,
        trackIds: copy
      };
    case "queue/SET_POSITION":
      return {
        ...state,
        position: action.payload
      };
    case "queue/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
