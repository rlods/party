import { combineReducers } from "redux";
import { containersReducer as containers } from "./containers";
import { messagesReducer as messages } from "./messages";
import { modalsReducer as modals } from "./modals";
import { roomsReducer as rooms } from "./rooms";
import { tracksReducer as tracks } from "./tracks";
import { usersReducer as users } from "./users";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  containers,
  messages,
  modals,
  rooms,
  tracks,
  users
});
