import { Reducer } from "redux";
import { Message, MessagesAction } from "../actions/messages";

// ------------------------------------------------------------------

export type State = Message[];

export const INITIAL_STATE: State = [];

// ------------------------------------------------------------------

export const messagesReducer: Reducer<State, MessagesAction> = (
  state = INITIAL_STATE,
  action
): State => {
  switch (action.type) {
    case "message/ADD":
      return [action.payload, ...state];
    case "message/REMOVE":
      return state.filter(other => other.id !== action.payload);
    case "message/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
