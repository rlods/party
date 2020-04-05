import { Reducer } from "redux";
import { AxiosError } from "axios";
import { MediasAction } from "../actions/medias";
import { Track, Album, Playlist } from "../utils/medias";

// ------------------------------------------------------------------

export type State = {
  fetching: boolean;
  error: null | AxiosError;
  albums: { [id: string]: Album };
  playlists: { [id: string]: Playlist };
  tracks: { [id: string]: Track };
};

const INITIAL_STATE: State = {
  fetching: false,
  error: null,
  albums: {},
  playlists: {},
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
