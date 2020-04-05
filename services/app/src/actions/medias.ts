import { AxiosError } from "axios";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { appendInQueue } from "./queue";
import { onlyUnique } from "../utils";
import {
  Media,
  MediaType,
  ProviderType,
  Track,
  Playlist,
  Album,
} from "../utils/medias";
import { extractErrorMessage } from "../utils/messages";

// ------------------------------------------------------------------

export type MediasAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof set>;

const fetching = () => createAction("medias/FETCHING");
const success = () => createAction("medias/FETCHED");
const error = (error: AxiosError) => createAction("medias/ERROR", error);
const reset = () => createAction("medias/RESET");
const set = (medias: Media[]) => createAction("medias/SET", medias);

// ------------------------------------------------------------------

export const loadMedias = (
  provider: ProviderType,
  mediaType: MediaType,
  mediaIds: string[],
  enqueue: boolean,
  preview: boolean
): AsyncAction => async (dispatch, getState, { deezer, previewPlayer }) => {
  if (mediaIds.length > 0) {
    const {
      medias: { medias },
    } = getState();
    try {
      if (mediaType === "track") {
        // TRACK
        const { track: oldTracks } = medias;
        const newTrackIds: string[] = mediaIds
          .filter((trackId) => !oldTracks[trackId])
          .filter(onlyUnique);
        let newTracks: Track[] = [];
        if (newTrackIds.length > 0) {
          console.debug("Loading tracks...", { mediaIds: newTrackIds });
          newTracks = await deezer.loadTracks(newTrackIds);
          dispatch(set(newTracks));
        }
        if (enqueue) {
          console.debug("Enqueuing tracks...", { mediaIds });
          dispatch(appendInQueue(provider, mediaIds));
        }
        if (preview) {
          const trackId = mediaIds[0];
          const track =
            oldTracks[trackId] ||
            newTracks.find((track) => track.id === trackId);
          console.debug("Previewing track...", { track, trackId });
          await previewPlayer.play(0, track.id, track.preview, 0);
        }
      } else {
        // CONTAINERS
        const { [mediaType]: oldContainers } = medias;
        const newContainerIds: string[] = mediaIds
          .filter((containerId) => !oldContainers[containerId])
          .filter(onlyUnique);
        let newContainers: Media[] = [];
        if (newContainerIds.length > 0) {
          console.debug("Loading containers...", { mediaIds: newContainerIds });
          newContainers = await deezer.load(mediaType, newContainerIds);

          const newContainersAndTracks = [...newContainers];
          for (const container of newContainers) {
            newContainersAndTracks.push(
              ...(container as Album | Playlist).tracks!
            );
          }

          dispatch(set(newContainersAndTracks));
        }

        if (enqueue) {
          console.debug("Enqueuing containers tracks...", { mediaIds });
          for (const containerId of mediaIds) {
            const container =
              oldContainers[containerId] ||
              newContainers.find((container) => container.id === containerId);
            dispatch(
              appendInQueue(
                provider,
                container.tracks!.map((track) => track.id)
              )
            );
          }
        }
        if (preview) {
          let track: Track | null = null;
          for (const containerId of mediaIds) {
            const container =
              oldContainers[containerId] ||
              newContainers.find((container) => container.id === containerId);
            if (container.tracks && container.tracks.length > 0) {
              track = container.tracks[0];
            }
          }
          if (track) {
            console.debug("Previewing container first track...");
            dispatch(loadMedias(provider, "track", [track.id], false, true));
          } else {
            console.debug("No container track found to preview...");
          }
        }
      }
    } catch (err) {
      dispatch(displayError(extractErrorMessage(err)));
    }
  }
};
