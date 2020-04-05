import { Reducer } from "redux";
import { AxiosError } from "axios";
import { MediasAction } from "../actions/medias";
import { Track, Album, Playlist } from "../utils/medias";

// ------------------------------------------------------------------

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  containers: {
    album: { [id: string]: Album };
    playlist: { [id: string]: Playlist };
  };
  tracks: { [id: string]: Track };
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  containers: {
    album: {},
    playlist: {},
  },
  tracks: {},
};

// ------------------------------------------------------------------

export const mediasReducer: Reducer<State, MediasAction> = (
  state = INITIAL_STATE,
  action: MediasAction
): State => {
  switch (action.type) {
    case "medias/FETCHING":
      return {
        ...state,
        fetching: true,
        error: null,
      };
    case "medias/FETCHED": {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case "medias/ERROR":
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    case "medias/SET_CONTAINERS": {
      const copy = {
        ...state,
        containers: {
          album: { ...state.containers.album },
          playlist: { ...state.containers.playlist },
        },
      };
      for (const container of action.payload) {
        copy.containers[container.type][container.id] = container;
      }
      return copy;
    }
    case "medias/SET_TRACKS": {
      const copy = { ...state, tracks: { ...state.tracks } };
      for (const track of action.payload) {
        copy.tracks[track.id] = track;
      }
      return copy;
    }
    case "medias/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
