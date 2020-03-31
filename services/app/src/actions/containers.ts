import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
//
import { createAction, AsyncAction } from ".";
import { RootState } from "../reducers";
import { Containers } from "../utils/containers";
import { loadAlbum, loadPlaylist } from "../utils/api";
import { displayError } from "./messages";

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
    if (!state.containers.containers[containerTypeId]) {
      if (containerType === "album") {
        console.log("Loading album...");
        dispatch(
          setContainers({ [containerTypeId]: await loadAlbum(containerId) })
        );
      }
      if (containerType === "playlist") {
        console.log("Loading playlist...");
        dispatch(
          setContainers({ [containerTypeId]: await loadPlaylist(containerId) })
        );
      }
    }
    if (enqueue) {
      console.log("TOTO: add container to queue");
    }
    if (play) {
      console.log("TOTO: play container");
    }
  } catch (err) {
    dispatch(displayError("Cannot load container", err));
  }
};
