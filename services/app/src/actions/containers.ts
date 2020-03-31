import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
//
import { createAction, AsyncAction } from ".";
import { RootState } from "../reducers";
import { Containers } from "../utils/containers";
import {
  loadAlbum as apiLoadAlbum,
  loadPlaylist as apiLoadPlaylist
} from "../utils/api";
import { displayError } from "./messages";
import { pushTrack } from "./queue";
import { loadTrack } from "./tracks";

// ------------------------------------------------------------------

export type ContainersAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setContainers>;

type Dispatch = ThunkDispatch<RootState, any, ContainersAction>;

const fetching = () => createAction("containers/FETCHING");
const success = () => createAction("containers/FETCHED");
const error = (error: AxiosError) => createAction("containers/ERROR", error);
const reset = () => createAction("containers/RESET");
const setContainers = (containers: Containers) =>
  createAction("containers/SET_CONTAINERS", containers);

// ------------------------------------------------------------------

export const loadContainer = (
  containerType: string,
  containerId: string,
  enqueue: boolean,
  play: boolean
): AsyncAction => async (dispatch, getState) => {
  try {
    const state = getState();
    const containerTypeId = `${containerType}|${containerId}`;
    let container = state.containers.containers[containerTypeId];
    if (!container) {
      console.log("Loading container...", { containerId, containerType });
      switch (containerType) {
        case "album":
          container = await apiLoadAlbum(containerId);
          dispatch(setContainers({ [containerTypeId]: container }));
          break;
        case "playlist":
          container = await apiLoadPlaylist(containerId);
          dispatch(setContainers({ [containerTypeId]: container }));
          break;
      }
    }
    if (container) {
      if (enqueue) {
        console.log("Enqueuing container...");
        container.tracks.data.forEach(track =>
          dispatch(pushTrack(track.id.toString()))
        );
      }
      if (play) {
        console.log("Playing container...");
        if (container.tracks.data.length > 0) {
          dispatch(
            loadTrack(container.tracks.data[0].id.toString(), false, true)
          );
        }
      }
    }
  } catch (err) {
    dispatch(displayError("Cannot load container", err));
  }
};
