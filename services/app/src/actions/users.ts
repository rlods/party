import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
import { createAction } from ".";
import { RootState } from "../reducers";
import { Users } from "../utils/users";

export type UsersAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>;

type Dispatch = ThunkDispatch<RootState, any, UsersAction>;

const fetching = () => createAction("users/FETCHING");
const success = (users: Users) => createAction("users/FETCHED", users);
const error = (error: AxiosError) => createAction("users/ERROR", error);
const reset = () => createAction("users/RESET");
