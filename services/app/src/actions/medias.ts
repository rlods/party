import { AxiosError } from "axios";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { appendInQueue } from "./queue";
import { Media, MediaType, ProviderType, Track } from "../utils/medias";
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

const onlyUnique = (value: string, index: number, self: string[]) =>
  self.indexOf(value) === index;

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
        const { track: oldTracks } = medias;
        const newTrackIds: string[] = mediaIds
          .filter((trackId) => !oldTracks[trackId])
          .filter(onlyUnique);
        let newTracks: Track[] = [];
        if (newTrackIds.length > 0) {
          console.debug("Loading track...", { mediaIds: newTrackIds });

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

          dispatch(set(newTracks));
        }
        if (enqueue) {
          console.debug("Enqueuing track...", { mediaIds });
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
        for (const mediaId of mediaIds) {
          // TODO: parallelize and batch
          let media = medias[mediaType][mediaId];
          if (!media) {
            console.debug("Loading container...", { mediaId, mediaType });
            switch (mediaType) {
              case "album":
                media = await deezer.loadAlbum(mediaId);
                break;
              case "playlist":
                media = await deezer.loadPlaylist(mediaId);
                break;
            }
          }
          if (media) {
            dispatch(set([media]));
            if (media.tracks && media.tracks.length > 0) {
              dispatch(set(media.tracks));
              if (enqueue) {
                console.debug("Enqueuing container tracks...");
                dispatch(
                  appendInQueue(
                    provider,
                    media.tracks.map((track) => track.id)
                  )
                );
              }
              if (preview) {
                console.debug("Previewing container first track...");
                dispatch(
                  loadMedias(
                    provider,
                    "track",
                    [media.tracks[0].id],
                    false,
                    true
                  )
                );
              }
            }
          }
        }
      }
    } catch (err) {
      dispatch(displayError(extractErrorMessage(err)));
    }
  }
};
