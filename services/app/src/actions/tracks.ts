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

const onlyUnique = (value: string, index: number, self: string[]) =>
  self.indexOf(value) === index;

export const loadTracks = (
  trackIds: string[],
  enqueue: boolean,
  play: boolean
): AsyncAction => async (dispatch, getState, { api, previewPlayer }) => {
  if (trackIds.length > 0) {
    try {
      const {
        tracks: { tracks: oldTracks }
      } = getState();
      const newTrackIds: string[] = trackIds
        .filter(trackId => !oldTracks[trackId])
        .filter(onlyUnique);
      let newTracks: ApiTrack[] = [];
      if (newTrackIds.length > 0) {
        console.log("Loading track...", { trackIds: newTrackIds });
        newTracks = await Promise.all(
          newTrackIds.map(trackId => api.loadTrack(trackId))
        );
        dispatch(setTracks(newTracks));
      }
      if (enqueue) {
        console.log("Enqueuing track...", { trackIds });
        dispatch(appendInQueue(trackIds));
      }
      if (play) {
        const trackId = trackIds[0];
        const track =
          oldTracks[trackId] ||
          newTracks.find(track => track.id.toString() === trackId);
        console.log("Previewing track...", { track, trackId });
        await previewPlayer.play(track.preview, 0);
      }
    } catch (err) {
      dispatch(displayError("Cannot load track", err));
    }
  }
};
