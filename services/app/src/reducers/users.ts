import { Reducer } from "redux";
import { AxiosError } from "axios";
import { UsersAction } from "../actions/users";
import {
  Users,
  saveUserAccess,
  loadUserAccess,
  UserAccess
} from "../utils/users";

// ------------------------------------------------------------------

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  user_access: UserAccess;
  users: Users;
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  user_access: loadUserAccess(),
  users: {}
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
        error: null
      };
    case "users/FETCHED": {
      return {
        ...state,
        fetching: false,
        error: null
      };
    }
    case "users/ERROR":
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    case "users/SET_USER": {
      saveUserAccess(action.payload);
      return {
        ...state,
        user_access: { ...action.payload }
      };
    }
    case "users/SET_USERS": {
      return {
        ...state,
        users: { ...state.users, ...action.payload }
      };
    }
    case "users/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
