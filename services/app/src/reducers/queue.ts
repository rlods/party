import { Reducer } from "redux";
import { QueueAction } from "../actions/queue";
import { MediaAccess } from "../utils/medias";

// ------------------------------------------------------------------

export type State = {
  medias: MediaAccess[];
  playing: boolean;
  position: number;
};

export const INITIAL_STATE: State = {
  medias: [],
  playing: false,
  position: 0,
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
