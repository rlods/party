import { AxiosError } from "axios";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { appendInQueue } from "./queue";
import {
  Track,
  TrackType,
  Provider,
  Container,
  ContainerType,
} from "../utils/medias";
import { extractErrorMessage } from "../utils/messages";

// ------------------------------------------------------------------

export type MediasAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setContainers>
  | ReturnType<typeof setTracks>;

const fetching = () => createAction("medias/FETCHING");
const success = () => createAction("medias/FETCHED");
const error = (error: AxiosError) => createAction("medias/ERROR", error);
const reset = () => createAction("medias/RESET");
const setContainers = (containers: Container[]) =>
  createAction("medias/SET_CONTAINERS", containers);
export const setTracks = (tracks: Track[]) =>
  createAction("medias/SET_TRACKS", tracks);

// ------------------------------------------------------------------

const onlyUnique = (value: string, index: number, self: string[]) =>
  self.indexOf(value) === index;

// ------------------------------------------------------------------

export const loadContainers = (
  provider: Provider,
  containerType: ContainerType,
  containerIds: string[],
  enqueue: boolean,
  preview: boolean
): AsyncAction => async (dispatch, getState, { deezer }) => {
  try {
    const {
      medias: { containers },
    } = getState();
    for (const containerId of containerIds) {
      // TODO: parallelize and batch
      let container = containers[containerType][containerId];
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
                provider,
                [container.tracks.data[0].id.toString()],
                false,
                true
              )
            );
          }
        }
      }
    }
  } catch (err) {
    dispatch(displayError(extractErrorMessage(err)));
  }
};

// ------------------------------------------------------------------

export const loadTracks = (
  provider: Provider,
  trackIds: string[],
  enqueue: boolean,
  preview: boolean
): AsyncAction => async (dispatch, getState, { deezer, previewPlayer }) => {
  if (trackIds.length > 0) {
    try {
      const {
        medias: { tracks: oldTracks },
      } = getState();
      const newTrackIds: string[] = trackIds
        .filter((trackId) => !oldTracks[trackId])
        .filter(onlyUnique);
      let newTracks: Track[] = [];
      if (newTrackIds.length > 0) {
        console.debug("Loading track...", { trackIds: newTrackIds });

        newTracks = await Promise.all(
          newTrackIds.map((trackId) => deezer.loadTrack(trackId))
        );

        if (newTrackIds.length > 1) {
          console.warn(
            `********* TODO Optimize & Handle Rate Limit to load ${newTrackIds.length} tracks`,
            newTracks
          );
          for (const track of newTracks) {
            if ((track as any).error) {
              console.warn(
                "********* TODO A rate limit error has been detected"
              );
              break;
            }
          }
        }

        dispatch(setTracks(newTracks));
      }
      if (enqueue) {
        console.debug("Enqueuing track...", { trackIds });
        dispatch(appendInQueue(trackIds));
      }
      if (preview) {
        const trackId = trackIds[0];
        const track =
          oldTracks[trackId] ||
          newTracks.find((track) => track.id.toString() === trackId);
        console.debug("Previewing track...", { track, trackId });
        await previewPlayer.play(0, track.id.toString(), track.preview, 0);
      }
    } catch (err) {
      dispatch(displayError(extractErrorMessage(err)));
    }
  }
};

// ------------------------------------------------------------------

export const previewContainer = (
  provider: Provider,
  containerType: ContainerType,
  containerId: string
): AsyncAction => async (dispatch) => {
  console.debug("Previewing container...", { containerType, containerId });
  dispatch(loadContainers(provider, containerType, [containerId], false, true));
};

// ------------------------------------------------------------------

export const previewTrack = (
  provider: Provider,
  trackType: TrackType,
  trackId: string
): AsyncAction => async (dispatch, getState, { deezer, previewPlayer }) => {
  try {
    const state = getState();
    let track = state.medias.tracks[trackId];
    if (!track) {
      console.debug("Loading track...", { trackId });
      track = await deezer.loadTrack(trackId);
      dispatch(setTracks([track]));
    }
    console.debug("Start previewing...");
    await previewPlayer.play(0, track.id.toString(), track.preview, 0);
  } catch (err) {
    dispatch(displayError(extractErrorMessage(err)));
  }
};
