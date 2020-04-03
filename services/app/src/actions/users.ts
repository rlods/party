import { AxiosError } from "axios";
import { v4 } from "uuid";
//
import { createAction, AsyncAction } from ".";
import { UserInfo } from "../utils/users";
import { FirebaseUser } from "../utils/firebase";
import { displayError } from "./messages";

// ------------------------------------------------------------------

export type UsersAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setUser>
  | ReturnType<typeof setUserAccess>;

const fetching = () => createAction("users/FETCHING");
const success = () => createAction("users/FETCHED");
const error = (error: AxiosError) => createAction("users/ERROR", error);
const reset = () => createAction("users/RESET");
const setUser = (
  user: ReturnType<typeof FirebaseUser> | null,
  info: UserInfo | null
) => createAction("users/SET_USER", { info, user });
const setUserAccess = (id: string, secret: string) =>
  createAction("users/SET_USER_ACCESS", { id, secret });

// ------------------------------------------------------------------

export const createUser = (
  name: string,
  secret: string
): AsyncAction => async dispatch => {
  try {
    console.log("Creating user...");
    const id = v4();
    await FirebaseUser(id, secret).update({ name });
    dispatch(connectUser(id, secret));
  } catch (err) {
    dispatch(displayError("Cannot create user", err));
  }
};

// ------------------------------------------------------------------

let FIREBASE_CB: any = null;

export const connectUser = (id: string, secret: string): AsyncAction => async (
  dispatch,
  getState
) => {
  const {
    users: { user }
  } = getState();
  if (!user || user.id !== id) {
    dispatch(disconnectUser());
    try {
      console.log("Connection user...", { id, secret });
      const newUser = FirebaseUser(id);
      dispatch(setUser(newUser, await newUser.wait()));
      dispatch(setUserAccess(id, secret));
      FIREBASE_CB = (snapshot: firebase.database.DataSnapshot) => {
        const newInfo = snapshot.val() as UserInfo;
        dispatch(setUser(newUser, newInfo));
      };
      newUser.subscribeInfo(FIREBASE_CB);
    } catch (err) {
      dispatch(displayError("Cannot connect user", err));
      dispatch(setUserAccess("", ""));
    }
  }
};

export const disconnectUser = (): AsyncAction => async (dispatch, getState) => {
  const {
    users: { user }
  } = getState();
  if (user) {
    console.log("Disconnecting user...");
    user.unsubscribeInfo(FIREBASE_CB);
    FIREBASE_CB = null;
    setUser(null, null);
    dispatch(setUserAccess("", ""));
  }
};

export const reconnectUser = (): AsyncAction => async (dispatch, getState) => {
  const {
    users: {
      user_access: { id, secret }
    }
  } = getState();
  if (id && secret) {
    console.log("Reconnecting user...", { id, secret });
    dispatch(connectUser(id, secret));
  }
};
