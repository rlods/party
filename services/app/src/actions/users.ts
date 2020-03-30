import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
import { createAction, AsyncAction } from ".";
import { RootState } from "../reducers";
import { Users, User } from "../utils/users";
import { User as FirebaseUser } from "../utils/firebase";
import { v4 } from "uuid";
import { displayError } from "./messages";

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
const setUser = (id: string, secret: string) =>
  createAction("users/SET_USER", { id, secret });
const setUsers = (users: Users) => createAction("users/SET_USERS", users);

// ------------------------------------------------------------------

export const createUser = (
  name: string,
  secret: string
): AsyncAction => async dispatch => {
  try {
    console.log("Creating user...");
    const id = v4();
    await FirebaseUser(id, secret).init({ name });
    dispatch(connectUser(id, secret));
  } catch (err) {
    dispatch(displayError("Cannot create user", err));
  }
};

// ------------------------------------------------------------------

let FIREBASE_USER: ReturnType<typeof FirebaseUser> | null = null;
let FIREBASE_CB: any = null;

export const connectUser = (
  id: string,
  secret: string
): AsyncAction => async dispatch => {
  dispatch(disconnectUser());
  try {
    console.log("Connection user...", { id, secret });
    const user = FirebaseUser(id);
    dispatch(setUsers({ [id]: await user.wait() }));
    dispatch(setUser(id, secret));
    FIREBASE_CB = (snapshot: firebase.database.DataSnapshot) => {
      dispatch(setUsers({ [id]: snapshot.val() as User }));
    };
    FIREBASE_USER = user;
    FIREBASE_USER.subscribeInfo(FIREBASE_CB);
  } catch (err) {
    dispatch(displayError("Cannot connect user", err));
  }
};

export const disconnectUser = (): AsyncAction => async dispatch => {
  if (FIREBASE_USER) {
    console.log("Disconnecting user...");
    FIREBASE_USER.unsubscribeInfo(FIREBASE_CB);
    FIREBASE_USER = null;
    FIREBASE_CB = null;
    dispatch(setUser("", ""));
  }
};

export const reconnectUser = (): AsyncAction => async (dispatch, getState) => {
  const state = getState();
  const { id, secret } = state.users.user;
  if (id && secret) {
    try {
      console.log("Loading user...");
      dispatch(connectUser(id, secret));
    } catch (err) {
      dispatch(displayError("Cannot load user", err));
    }
  }
};
