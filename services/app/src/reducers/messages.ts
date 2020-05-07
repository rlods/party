import { Reducer } from "redux";
import { Message } from "../utils/messages";
import { createAction } from "../actions";

// ------------------------------------------------------------------

type MessagesAction =
	| ReturnType<typeof addMessage>
	| ReturnType<typeof clearMessages>
	| ReturnType<typeof removeMessages>;

export const addMessage = (
	id: number,
	message: Message,
	timer?: NodeJS.Timeout
) => createAction("message/ADD", { timer, id, message });
export const removeMessages = (ids: ReadonlyArray<number>) =>
	createAction("message/REMOVE", { ids });
export const clearMessages = (tag?: string) =>
	createAction("message/RESET", { tag });

// ------------------------------------------------------------------

export type State = Readonly<{ [id: string]: Message }>;

export const INITIAL_STATE: State = {};

// ------------------------------------------------------------------

export const messagesReducer: Reducer<State, MessagesAction> = (
	state = INITIAL_STATE,
	action
): State => {
	switch (action.type) {
		case "message/ADD":
			return {
				...state,
				[action.payload.id]: {
					timer: action.payload.timer,
					...action.payload.message
				}
			};
		case "message/REMOVE": {
			const copy = { ...state };
			for (const id of action.payload.ids) {
				delete copy[id];
			}
			return copy;
		}
		case "message/RESET": {
			if (!action.payload.tag) {
				return INITIAL_STATE;
			}
			const copy = { ...state };
			Object.entries(state).forEach(([id, message]) => {
				if (message.tag === action.payload.tag) {
					delete copy[id];
				}
			});
			return copy;
		}
		default:
			return state;
	}
};
