import { AsyncAction, createAction } from ".";
import { setTracks } from "./tracks";
import { displayError } from "./messages";
import { setRoomColor } from "./rooms";
import { pickColor } from "../utils/colorpicker";

// ------------------------------------------------------------------

export type PlayerAction =
  | ReturnType<typeof reset>
  | ReturnType<typeof start>
  | ReturnType<typeof stop>;

const reset = () => createAction("player/RESET");

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
      // console.log("TESTING", { position, PLAYER_POSITION, COUNT: trackIds.length });
      if (
        position !== PLAYER_POSITION &&
        position >= 0 &&
        position < trackIds.length
      ) {
        console.log("PLAYING", { position });
        PLAYER_POSITION = position;
        const track = tracks.tracks[trackIds[position]];
        await queuePlayer.load(track.preview);
        queuePlayer.play(0);
        dispatch(setRoomColor(await pickColor(track.album.cover_small)));
      }
    }, 1000);
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
    await previewPlayer.load(track.preview);
    previewPlayer.play(0);
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
