import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
//
import { createAction, AsyncAction } from ".";
import { RootState } from "../reducers";
import { displayError } from "./messages";
import { loadAudio } from "./player";
import { pushTracks } from "./queue";
import { ApiTrack } from "../utils/api";

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
export const setTracks = (tracks: ApiTrack[]) =>
  createAction("tracks/SET_TRACKS", tracks);

// ------------------------------------------------------------------

export const loadTrack = (
  trackId: string,
  enqueue: boolean,
  play: boolean
): AsyncAction => async (dispatch, getState, { api }) => {
  try {
    const state = getState();
    let track = state.tracks.tracks[trackId];
    if (!track) {
      console.log("Loading track...", { trackId });
      track = await api.loadTrack(trackId);
      dispatch(setTracks([track]));
    }
    if (enqueue) {
      console.log("Enqueuing track...");
      dispatch(pushTracks([trackId]));
    }
    if (play) {
      console.log("Playing track...");
      dispatch(loadAudio(track.preview, true, 0));
    }
  } catch (err) {
    dispatch(displayError("Cannot load track", err));
  }
};

// ------------------------------------------------------------------

export const previewTrack = (
  trackId: string
): AsyncAction => async dispatch => {
  console.log("Previewing track...", { trackId });
  dispatch(loadTrack(trackId, false, true));
};
