import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
//
import { createAction, AsyncAction } from ".";
import { RootState } from "../reducers";
import { Container, ContainerType } from "../utils/containers";
import { displayError } from "./messages";
import { pushTracks } from "./queue";
import { loadTrack, setTracks } from "./tracks";

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
const setContainers = (containers: Container[]) =>
  createAction("containers/SET_CONTAINERS", containers);

// ------------------------------------------------------------------

export const loadContainer = (
  containerType: ContainerType,
  containerId: string,
  enqueue: boolean,
  play: boolean
): AsyncAction => async (dispatch, getState, { api }) => {
  try {
    const state = getState();
    const containerTypeId = `${containerType}|${containerId}`;
    let container = state.containers.containers[containerTypeId];
    if (!container) {
      console.log("Loading container...", { containerId, containerType });
      switch (containerType) {
        case "album":
          container = await api.loadAlbum(containerId);
          break;
        case "playlist":
          container = await api.loadPlaylist(containerId);
          break;
      }
    }
    if (container) {
      dispatch(setContainers([container]));
      if (container.tracks && container.tracks.data.length > 0) {
        dispatch(setTracks(container.tracks.data));
        if (enqueue) {
          console.log("Enqueuing container...");
          dispatch(
            pushTracks(container.tracks.data.map(track => track.id.toString()))
          );
        }
        if (play) {
          console.log("Playing container...");
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
