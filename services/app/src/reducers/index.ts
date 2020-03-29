import { combineReducers } from "redux";
import { roomsReducer as rooms } from "./rooms";
import { usersReducer as users } from "./users";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  rooms,
  users
});
