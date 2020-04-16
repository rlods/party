import { Reducer } from "redux";
import { Message } from "../utils/messages";
import { createAction } from "../actions";

// ------------------------------------------------------------------

type MessagesAction =
	| ReturnType<typeof addMessage>
	| ReturnType<typeof clearMessages>
	| ReturnType<typeof removeMessage>;

export const addMessage = (message: Message) =>
	createAction("message/ADD", message);
export const removeMessage = (id: number) => createAction("message/REMOVE", id);
export const clearMessages = () => createAction("message/RESET");

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
