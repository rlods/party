import { AxiosError } from "axios";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { pushTracks } from "./queue";
import { ApiTrack } from "../utils/api";

// ------------------------------------------------------------------

export type TracksAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setTracks>;

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
): AsyncAction => async (dispatch, getState, { api, previewPlayer }) => {
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
      console.log("Previewing track...");
      await previewPlayer.load(track.preview);
      previewPlayer.play(0);
    }
  } catch (err) {
    dispatch(displayError("Cannot load track", err));
  }
};
