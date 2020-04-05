import { Reducer } from "redux";
import { AxiosError } from "axios";
import { MediasAction } from "../actions/medias";
import { Track, Album, Playlist } from "../utils/medias";

// ------------------------------------------------------------------

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  medias: {
    // keys are MediaType
    album: { [id: string]: Album };
    playlist: { [id: string]: Playlist };
    track: { [id: string]: Track };
  };
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  medias: {
    // keys are MediaType
    album: {},
    playlist: {},
    track: {},
  },
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
    case "medias/SET": {
      const copy = {
        ...state,
        medias: {
          album: { ...state.medias.album },
          playlist: { ...state.medias.playlist },
          track: { ...state.medias.track },
        },
      };
      for (const media of action.payload) {
        copy.medias[media.type][media.id] = media;
      }
      return copy;
    }
    case "medias/RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
