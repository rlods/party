import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
import { createAction } from ".";
import { RootState } from "../reducers";
import { Users } from "../utils/users";

// ------------------------------------------------------------------

export type UsersAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setUser>
  | ReturnType<typeof setUsers>;

type Dispatch = ThunkDispatch<RootState, any, UsersAction>;

const fetching = () => createAction("users/FETCHING");
const success = () => createAction("users/FETCHED");
const error = (error: AxiosError) => createAction("users/ERROR", error);
const reset = () => createAction("users/RESET");
const setUser = (id: string) => createAction("users/SET_USER", id);
const setUsers = (users: Users) => createAction("users/SET_USERS", users);

// ------------------------------------------------------------------
