import { Reducer } from "redux";
import { Message, MessagesAction } from "../actions/messages";

// ------------------------------------------------------------------

export type State = Message[];

export const initialState: State = [];

export const messagesReducer: Reducer<State, MessagesAction> = (
  state = initialState,
  action
): State => {
  switch (action.type) {
    case "message/ADD":
      return [action.payload, ...state];
    case "message/REMOVE":
      return state.filter(other => other.id !== action.payload);
    default:
      return state;
  }
};
