import { AxiosError } from "axios";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { appendInQueue } from "./queue";
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

export const loadTracks = (
  trackIds: string[],
  enqueue: boolean,
  play: boolean
): AsyncAction => async (dispatch, getState, { api, previewPlayer }) => {
  if (trackIds.length > 0) {
    try {
      const state = getState();
      const notLoadedTrackIds: string[] = trackIds.filter(
        trackId => !state.tracks.tracks[trackId]
      );
      if (notLoadedTrackIds.length > 0) {
        // TODO: clear duplicates which can exists
        console.log("Loading track...", { trackIds: notLoadedTrackIds });
        dispatch(
          setTracks(
            await Promise.all(
              notLoadedTrackIds.map(trackId => api.loadTrack(trackId))
            )
          )
        );
      }
      if (enqueue) {
        console.log("Enqueuing track...", { trackIds });
        dispatch(appendInQueue(trackIds));
      }
      if (play) {
        console.log("Previewing track...", { trackId: trackIds[0] });
        await previewPlayer.play(state.tracks.tracks[trackIds[0]].preview, 0);
      }
    } catch (err) {
      dispatch(displayError("Cannot load track", err));
    }
  }
};
