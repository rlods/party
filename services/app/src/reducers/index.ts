import { combineReducers } from "redux";
import { mediasReducer as medias } from "./medias";
import { messagesReducer as messages } from "./messages";
import { modalsReducer as modals } from "./modals";
import { playerReducer as player } from "./player";
import { roomReducer as room } from "./room";
import { userReducer as user } from "./user";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
	medias,
	messages,
	modals,
	player,
	room,
	user
});
