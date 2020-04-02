import { Reducer } from "redux";
import { AxiosError } from "axios";
import { ContainersAction } from "../actions/containers";
import { Containers } from "../utils/containers";

// ------------------------------------------------------------------

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  containers: Containers;
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  containers: {}
};

// ------------------------------------------------------------------

export const containersReducer: Reducer<State, ContainersAction> = (
  state = INITIAL_STATE,
  action: ContainersAction
): State => {
  switch (action.type) {
    case "containers/FETCHING":
      return {
        ...state,
        fetching: true,
        error: null
      };
    case "containers/FETCHED": {
      return {
        ...state,
        fetching: false,
        error: null
      };
    }
    case "containers/ERROR":
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    case "containers/SET_CONTAINERS": {
      const copy = { ...state, containers: { ...state.containers } };
      for (const container of action.payload) {
        copy.containers[`${container.type}|${container.id}`] = container;
      }
      return copy;
    }
    case "containers/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
