import { combineReducers } from "redux";
import { mediasReducer as medias } from "./medias";
import { messagesReducer as messages } from "./messages";
import { modalsReducer as modals } from "./modals";
import { playerReducer as player } from "./player";
import { queueReducer as queue } from "./queue";
import { roomsReducer as rooms } from "./rooms";
import { usersReducer as users } from "./users";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  medias,
  messages,
  modals,
  player,
  queue,
  rooms,
  users,
});
