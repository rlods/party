import { AxiosError } from "axios";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { appendInQueue } from "./queue";
import { Media, MediaType, Provider, Track } from "../utils/medias";
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
  provider: Provider,
  mediaType: MediaType,
  mediaIds: string[],
  enqueue: boolean,
  preview: boolean
): AsyncAction => async (dispatch, getState, { deezer, previewPlayer }) => {
  if (mediaIds.length > 0) {
    const {
      medias: { medias },
    } = getState();
    if (mediaType === "album" || mediaType === "playlist") {
      try {
        for (const mediaId of mediaIds) {
          // TODO: parallelize and batch
          let media = medias[mediaType][mediaId];
          if (!media) {
            console.debug("Loading media...", { mediaId, mediaType });
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
            if (media.tracks && media.tracks.data.length > 0) {
              dispatch(set(media.tracks.data));
              if (enqueue) {
                console.debug("Enqueuing media...");
                dispatch(
                  appendInQueue(
                    media.tracks.data.map((track) => track.id.toString())
                  )
                );
              }
              if (preview) {
                console.debug("Previewing media...");
                dispatch(
                  loadMedias(
                    provider,
                    mediaType,
                    [media.tracks.data[0].id.toString()],
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
    } else {
      try {
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
          dispatch(appendInQueue(mediaIds));
        }
        if (preview) {
          const trackId = mediaIds[0];
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
  }
};

// ------------------------------------------------------------------

export const previewMedia = (
  provider: Provider,
  mediaType: MediaType,
  mediaId: string
): AsyncAction => async (dispatch, getState, { deezer, previewPlayer }) => {
  console.debug("Previewing media...", { mediaType, mediaId });
  if (mediaType === "album" || mediaType === "playlist") {
    dispatch(loadMedias(provider, mediaType, [mediaId], false, true));
  } else {
    try {
      const {
        medias: {
          medias: { track: tracks },
        },
      } = getState();
      let track = tracks[mediaId];
      if (!track) {
        console.debug("Loading track...", { mediaId });
        track = await deezer.loadTrack(mediaId);
        dispatch(set([track]));
      }
      console.debug("Start previewing...");
      await previewPlayer.play(0, track.id.toString(), track.preview, 0);
    } catch (err) {
      dispatch(displayError(extractErrorMessage(err)));
    }
  }
};
