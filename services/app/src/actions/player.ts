import { AsyncAction, createAction } from ".";
import { setTracks } from "./tracks";
import { displayError } from "./messages";
import { setRoomColor } from "./rooms";
import { pickColor } from "../utils/colorpicker";
import { setQueuePosition } from "./queue";
import { ApiTrack } from "../utils/api";

// ------------------------------------------------------------------

export type PlayerAction =
  | ReturnType<typeof reset>
  | ReturnType<typeof setPlayerPosition>
  | ReturnType<typeof start>
  | ReturnType<typeof stop>;

const reset = () => createAction("player/RESET");
const setPlayerPosition = (position: number) =>
  createAction("player/SET_POSITION", position);
const start = () => createAction("player/START");
const stop = () => createAction("player/STOP");

// ------------------------------------------------------------------

let PLAYER_TIMER: NodeJS.Timeout | null = null;
let PLAYER_PLAYING_TRACK: ApiTrack | null = null;
let PLAYER_PLAYING_TRACK_INDEX = -1;

export const startPlayer = (): AsyncAction => async (
  dispatch,
  getState,
  { queuePlayer }
) => {
  if (!PLAYER_TIMER) {
    PLAYER_TIMER = setInterval(async () => {
      const {
        queue: { position, trackIds },
        tracks
      } = getState();
      if (trackIds.length > 0) {
        /*
        console.log(
          "TOTO",
          PLAYER_PLAYING_TRACK_INDEX,
          position,
          trackIds.length
        );
        */
        if (
          PLAYER_PLAYING_TRACK_INDEX !== position ||
          (position >= 0 &&
            PLAYER_PLAYING_TRACK !== tracks.tracks[trackIds[position]])
        ) {
          // User has clicked an other track or added/removed a track in queue
          PLAYER_PLAYING_TRACK_INDEX = position;
          PLAYER_PLAYING_TRACK =
            tracks.tracks[trackIds[PLAYER_PLAYING_TRACK_INDEX]];
          console.log("Playing clicked...", {
            id: PLAYER_PLAYING_TRACK.id,
            index: PLAYER_PLAYING_TRACK_INDEX
          });
          dispatch(setQueuePosition(PLAYER_PLAYING_TRACK_INDEX));
          dispatch(
            setRoomColor(
              await pickColor(PLAYER_PLAYING_TRACK.album.cover_small)
            )
          );
          await queuePlayer.play(PLAYER_PLAYING_TRACK.preview, 0);
        } else if (!queuePlayer.isPlaying()) {
          // Not playing which means previous track has terminated
          const nextPosition = (position + 1) % trackIds.length;
          if (nextPosition < trackIds.length) {
            // Time to move to next track
            PLAYER_PLAYING_TRACK_INDEX = nextPosition;
            PLAYER_PLAYING_TRACK =
              tracks.tracks[trackIds[PLAYER_PLAYING_TRACK_INDEX]];
            console.log("Playing next...", {
              id: PLAYER_PLAYING_TRACK.id,
              index: PLAYER_PLAYING_TRACK_INDEX
            });
            dispatch(setQueuePosition(PLAYER_PLAYING_TRACK_INDEX));
            dispatch(
              setRoomColor(
                await pickColor(PLAYER_PLAYING_TRACK.album.cover_small)
              )
            );
            await queuePlayer.play(PLAYER_PLAYING_TRACK.preview, 0);
          }
        }
        dispatch(setPlayerPosition(queuePlayer.getPosition()));
      } else {
        // Last track has been removed from queue by user
        console.log("No more tracks in queue...");
        dispatch(stopPlayer());
      }
    }, 250);
    dispatch(start());
  }
};

// ------------------------------------------------------------------

export const stopPlayer = (): AsyncAction => async (
  dispatch,
  _,
  { queuePlayer }
) => {
  if (PLAYER_TIMER) {
    clearInterval(PLAYER_TIMER);
    PLAYER_TIMER = null;
    PLAYER_PLAYING_TRACK = null;
    PLAYER_PLAYING_TRACK_INDEX = -1;

    queuePlayer.stop();
    dispatch(stop());
    dispatch(setPlayerPosition(0));
  }
};

// ------------------------------------------------------------------

export const startPreview = (trackId: string): AsyncAction => async (
  dispatch,
  getState,
  { api, previewPlayer }
) => {
  try {
    const state = getState();
    let track = state.tracks.tracks[trackId];
    if (!track) {
      console.log("Loading track...", { trackId });
      track = await api.loadTrack(trackId);
      dispatch(setTracks([track]));
    }
    console.log("Start previewing...");
    await previewPlayer.play(track.preview, 0);
  } catch (err) {
    dispatch(displayError("Cannot load track", err));
  }
};

// ------------------------------------------------------------------

export const stopPreview = (): AsyncAction => async (
  _1,
  _2,
  { previewPlayer }
) => {
  console.log("Stop previewing...");
  previewPlayer.stop();
};
