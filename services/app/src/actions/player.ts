import { AsyncAction, createAction } from ".";
import { setTracks } from "./tracks";
import { displayError } from "./messages";
import { setRoomColor } from "./rooms";
import { pickColor } from "../utils/colorpicker";
import { setQueuePosition } from "./queue";

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
let PLAYER_POSITION = -1;

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
        if (PLAYER_POSITION !== position) {
          // User has clicked an other track
          PLAYER_POSITION = position;
          console.log("Playing clicked track...", {
            position: PLAYER_POSITION
          });
          const track = tracks.tracks[trackIds[PLAYER_POSITION]];
          await queuePlayer.play(track.preview, 0);
          dispatch(setQueuePosition(PLAYER_POSITION));
          dispatch(setRoomColor(await pickColor(track.album.cover_small)));
        } else {
          const nextPosition = (position + 1) % trackIds.length;
          if (!queuePlayer.isPlaying() && nextPosition < trackIds.length) {
            // Time to move to next track
            PLAYER_POSITION = nextPosition;
            console.log("Playing next track...", { position: PLAYER_POSITION });
            const track = tracks.tracks[trackIds[PLAYER_POSITION]];
            await queuePlayer.play(track.preview, 0);
            dispatch(setQueuePosition(PLAYER_POSITION));
            dispatch(setRoomColor(await pickColor(track.album.cover_small)));
          }
        }
        dispatch(setPlayerPosition(queuePlayer.getPosition()));
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
    PLAYER_POSITION = -1;

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
