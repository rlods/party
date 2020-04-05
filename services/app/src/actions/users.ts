import { AxiosError } from "axios";
import { v4 } from "uuid";
//
import { createAction, AsyncAction } from ".";
import { UserInfo } from "../utils/users";
import { FirebaseUser } from "../utils/firebase";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";

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
) => createAction("users/SET", { user, user_info: info });
const setUserAccess = (id: string, secret: string) =>
  createAction("users/SET_ACCESS", { id, secret });

// ------------------------------------------------------------------

export const createUser = (name: string, secret: string): AsyncAction => async (
  dispatch
) => {
  try {
    console.debug("Creating user...");
    const id = v4();
    await FirebaseUser(id, secret).update({ name });
    dispatch(connectUser(id, secret));
  } catch (err) {
    dispatch(displayError(extractErrorMessage(err)));
  }
};

// ------------------------------------------------------------------

let FIREBASE_CB: any = null;

export const connectUser = (id: string, secret: string): AsyncAction => async (
  dispatch,
  getState
) => {
  const {
    users: { user },
  } = getState();
  if (!user || user.id !== id) {
    dispatch(disconnectUser());
    try {
      console.debug("Connection user...", { id, secret });
      const newUser = FirebaseUser(id);
      dispatch(setUser(newUser, await newUser.wait()));
      dispatch(setUserAccess(id, secret));
      FIREBASE_CB = newUser.subscribeInfo(
        (snapshot: firebase.database.DataSnapshot) => {
          const newInfo = snapshot.val() as UserInfo;
          console.debug("[Firebase] Received user update...", newInfo);
          dispatch(setUser(newUser, newInfo));
        }
      );
    } catch (err) {
      dispatch(displayError(extractErrorMessage(err)));
      dispatch(setUserAccess("", ""));
    }
  }
};

export const disconnectUser = (): AsyncAction => async (dispatch, getState) => {
  const {
    users: { user },
  } = getState();
  if (user) {
    console.debug("Disconnecting user...");
    user.unsubscribeInfo(FIREBASE_CB);
    FIREBASE_CB = null;
    setUser(null, null);
    dispatch(setUserAccess("", ""));
  }
};

export const reconnectUser = (): AsyncAction => async (dispatch, getState) => {
  const {
    users: {
      user_access: { id, secret },
    },
  } = getState();
  if (id && secret) {
    console.debug("Reconnecting user...", { id, secret });
    dispatch(connectUser(id, secret));
  }
};
