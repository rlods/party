import { AxiosError } from "axios";
//
import { createAction, AsyncAction } from ".";
import { Container, ContainerType, ProviderType } from "../utils/medias";
import { displayError } from "./messages";
import { appendInQueue } from "./queue";
import { loadTracks, setTracks } from "./tracks";

// ------------------------------------------------------------------

export type ContainersAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setContainers>;

const fetching = () => createAction("containers/FETCHING");
const success = () => createAction("containers/FETCHED");
const error = (error: AxiosError) => createAction("containers/ERROR", error);
const reset = () => createAction("containers/RESET");
const setContainers = (containers: Container[]) =>
  createAction("containers/SET_CONTAINERS", containers);

// ------------------------------------------------------------------

export const loadContainer = (
  providerType: ProviderType,
  containerType: ContainerType,
  containerId: string,
  enqueue: boolean,
  preview: boolean
): AsyncAction => async (dispatch, getState, { deezer }) => {
  try {
    const state = getState();
    let container: Container | null = null;
    switch (containerType) {
      case "album":
        container = state.containers.albums[containerId];
        break;
      case "playlist":
        container = state.containers.playlists[containerId];
        break;
    }
    if (!container) {
      console.debug("Loading container...", { containerId, containerType });
      switch (containerType) {
        case "album":
          container = await deezer.loadAlbum(containerId);
          break;
        case "playlist":
          container = await deezer.loadPlaylist(containerId);
          break;
      }
    }
    if (container) {
      dispatch(setContainers([container]));
      if (container.tracks && container.tracks.data.length > 0) {
        dispatch(setTracks(container.tracks.data));
        if (enqueue) {
          console.debug("Enqueuing container...");
          dispatch(
            appendInQueue(
              container.tracks.data.map((track) => track.id.toString())
            )
          );
        }
        if (preview) {
          console.debug("Previewing container...");
          dispatch(
            loadTracks(
              providerType,
              [container.tracks.data[0].id.toString()],
              false,
              true
            )
          );
        }
      }
    }
  } catch (err) {
    dispatch(displayError("Cannot load container", err));
  }
};

// ------------------------------------------------------------------

export const previewContainer = (
  providerType: ProviderType,
  containerType: ContainerType,
  containerId: string
): AsyncAction => async (dispatch) => {
  console.debug("Previewing container...", { containerType, containerId });
  dispatch(
    loadContainer(providerType, containerType, containerId, false, true)
  );
};
