import { combineReducers } from "redux";
import { appReducer as app } from "./app";
import { gamesReducer as games } from "./games";
import { mediasReducer as medias } from "./medias";
import { messagesReducer as messages } from "./messages";
import { modalsReducer as modals } from "./modals";
import { roomReducer as room } from "./room";
import { userReducer as user } from "./user";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
	app,
	games,
	medias,
	messages,
	modals,
	room,
	user
});
