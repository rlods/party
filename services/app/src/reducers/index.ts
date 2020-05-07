import { combineReducers } from "redux";
import * as app from "./app";
import * as medias from "./medias";
import * as messages from "./messages";
import * as modals from "./modals";
import * as room from "./room";
import * as user from "./user";

// ------------------------------------------------------------------

export type RootState = ReturnType<typeof rootReducer>;

// Mostly useful for tests
export const INITIAL_STATE: RootState = {
	app: app.INITIAL_STATE,
	medias: medias.INITIAL_STATE,
	messages: messages.INITIAL_STATE,
	modals: modals.INITIAL_STATE,
	room: room.INITIAL_STATE,
	user: user.INITIAL_STATE
};

export const rootReducer = combineReducers({
	app: app.appReducer,
	medias: medias.mediasReducer,
	messages: messages.messagesReducer,
	modals: modals.modalsReducer,
	room: room.roomReducer,
	user: user.userReducer
});
