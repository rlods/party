import { Reducer } from "redux";
import { AxiosError } from "axios";
import { UsersAction } from "../actions/users";
import {
  saveUserAccess,
  loadUserAccess,
  UserAccess,
  UserInfo,
} from "../utils/users";
import { FirebaseUser } from "../utils/firebase";

// ------------------------------------------------------------------

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  user: ReturnType<typeof FirebaseUser> | null;
  user_access: UserAccess;
  user_info: UserInfo | null;
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  user: null,
  user_access: loadUserAccess(),
  user_info: null,
};

// ------------------------------------------------------------------

export const usersReducer: Reducer<State, UsersAction> = (
  state = INITIAL_STATE,
  action: UsersAction
): State => {
  switch (action.type) {
    case "users/FETCHING":
      return {
        ...state,
        fetching: true,
        error: null,
      };
    case "users/FETCHED": {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case "users/ERROR":
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    case "users/SET_USER": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "users/SET_USER_ACCESS": {
      saveUserAccess(action.payload);
      return {
        ...state,
        user_access: action.payload,
      };
    }
    case "users/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
