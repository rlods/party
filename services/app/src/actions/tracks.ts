import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
//
import { createAction, AsyncAction } from ".";
import { RootState } from "../reducers";
import { Tracks } from "../utils/tracks";
import { displayError } from "./messages";
import { load } from "./player";
import { loadTrack as apiLoadTrack } from "../utils/api";

// ------------------------------------------------------------------

export type TracksAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setTracks>;

type Dispatch = ThunkDispatch<RootState, any, TracksAction>;

const fetching = () => createAction("tracks/FETCHING");
const success = () => createAction("tracks/FETCHED");
const error = (error: AxiosError) => createAction("tracks/ERROR", error);
const reset = () => createAction("tracks/RESET");
const setTracks = (tracks: Tracks) => createAction("tracks/SET_TRACKS", tracks);

// ------------------------------------------------------------------

export const loadTrack = (
  trackId: string,
  enqueue: boolean,
  play: boolean
): AsyncAction => async (dispatch, getState) => {
  try {
    const state = getState();
    let track = state.tracks.tracks[trackId];
    if (!track) {
      console.log("Loading track...", { trackId });
      track = await apiLoadTrack(trackId);
      dispatch(setTracks({ [trackId]: track }));
    }
    if (enqueue) {
      console.log("TOTO: add track to queue");
    }
    if (play) {
      console.log("TOTO: play track");
      dispatch(load(track.preview, true, 0));
    }
  } catch (err) {
    dispatch(displayError("Cannot load track", err));
  }
};
