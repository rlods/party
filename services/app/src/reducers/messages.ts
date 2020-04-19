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
export const clearMessages = (tag?: string) =>
	createAction("message/RESET", { tag });

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
			return !action.payload.tag
				? INITIAL_STATE
				: state.filter(message => message.tag !== action.payload.tag);
		default:
			return state;
	}
};
