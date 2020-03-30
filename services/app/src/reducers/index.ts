import { combineReducers } from "redux";
import { messagesReducer as messages } from "./messages";
import { modalsReducer as modals } from "./modals";
import { roomsReducer as rooms } from "./rooms";
import { usersReducer as users } from "./users";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  messages,
  modals,
  rooms,
  users
});
