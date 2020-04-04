import { Reducer } from "redux";
import { AxiosError } from "axios";
import { ContainersAction } from "../actions/containers";
import { Album, Playlist } from "../utils/medias";

// ------------------------------------------------------------------

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  albums: { [id: string]: Album };
  playlists: { [id: string]: Playlist };
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  albums: {},
  playlists: {},
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
        error: null,
      };
    case "containers/FETCHED": {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case "containers/ERROR":
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    case "containers/SET_CONTAINERS": {
      const copy = {
        ...state,
        albums: { ...state.albums },
        playlists: { ...state.playlists },
      };
      for (const container of action.payload) {
        switch (container.type) {
          case "album":
            copy.albums[container.id] = container;
            break;
          case "playlist":
            copy.playlists[container.id] = container;
            break;
        }
      }
      return copy;
    }
    case "containers/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
