import { Reducer } from "redux";
import { AxiosError } from "axios";
import { UsersAction } from "../actions/users";
import { Users } from "../utils/users";

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  items: Users;
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  items: {}
};

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
        error: null,
        items: { ...state.items, ...action.payload }
      };
    }
    case "users/ERROR":
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    case "users/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
