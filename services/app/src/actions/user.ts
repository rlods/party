import { AxiosError } from "axios";
import { v4 } from "uuid";
//
import { createAction, AsyncAction } from ".";
import { UserInfo } from "../utils/users";
import { FirebaseUser } from "../utils/firebase";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";
import { UserData } from "../reducers/user";

// ------------------------------------------------------------------

export type UserAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof resetUser>
  | ReturnType<typeof setUser>;

const fetching = () => createAction("user/FETCHING");
const success = () => createAction("user/FETCHED");
const error = (error: AxiosError) => createAction("user/ERROR", error);
const resetUser = () => createAction("user/RESET");
const setUser = (values: Partial<UserData>) => createAction("user/SET", values);

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
    user: { user },
  } = getState();
  if (!user || user.id !== id) {
    dispatch(disconnectUser());
    try {
      console.debug("Connection user...", { id, secret });
      const newUser = FirebaseUser(id);
      dispatch(
        setUser({
          access: { id, secret },
          user: newUser,
          info: await newUser.wait(),
        })
      );
      FIREBASE_CB = newUser.subscribeInfo(
        (snapshot: firebase.database.DataSnapshot) => {
          const newInfo = snapshot.val() as UserInfo;
          console.debug("[Firebase] Received user update...", newInfo);
          dispatch(setUser({ user: newUser, info: newInfo }));
        }
      );
    } catch (err) {
      dispatch(displayError(extractErrorMessage(err)));
      dispatch(setUser({ access: { id, secret: "" } }));
    }
  }
};

export const disconnectUser = (): AsyncAction => async (dispatch, getState) => {
  const {
    user: { user },
  } = getState();
  if (user) {
    console.debug("Disconnecting user...");
    user.unsubscribeInfo(FIREBASE_CB);
    FIREBASE_CB = null;
    dispatch(resetUser());
  }
};

export const reconnectUser = (): AsyncAction => async (dispatch, getState) => {
  const {
    user: {
      access: { id, secret },
    },
  } = getState();
  if (id && secret) {
    console.debug("Reconnecting user...", { id, secret });
    dispatch(connectUser(id, secret));
  }
};
