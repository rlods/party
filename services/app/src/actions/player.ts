import { AsyncAction, createAction, Dispatch } from ".";
import { setTracks } from "./tracks";
import { displayError } from "./messages";
import { setRoomColor } from "./rooms";
import { pickColor } from "../utils/colorpicker";
import { setQueuePosition } from "./queue";
import { Player } from "../utils/player";
import { RootState } from "../reducers";

// ------------------------------------------------------------------

export type PlayerAction =
  | ReturnType<typeof reset>
  | ReturnType<typeof setPlayerTrackPercent>
  | ReturnType<typeof start>
  | ReturnType<typeof stop>;

const reset = () => createAction("player/RESET");
const setPlayerTrackPercent = (percent: number) =>
  createAction("player/SET_TRACK_PERCENT", percent);
const start = () => createAction("player/START");
const stop = () => createAction("player/STOP");

// ------------------------------------------------------------------

let PLAYER_TIMER: NodeJS.Timeout | null = null;

const _computeNextPosition = (
  queuePlayer: ReturnType<typeof Player>,
  playingPosition: number,
  queuePosition: number
) => {
  let nextPosition = -1;
  if (playingPosition !== queuePosition) {
    console.debug("Detected play change...", {
      playingPosition,
      queuePosition,
      isPlaying: queuePlayer.isPlaying()
    });
    if (queuePlayer.isPlaying()) {
      // User has clicked an other track or added/removed a track in queue
      nextPosition = queuePosition;
    } else {
      // Not playing which means previous track has terminated
      nextPosition = playingPosition >= 0 ? playingPosition : queuePosition;
    }
  }
  return nextPosition;
};

const _installTimer = (
  dispatch: Dispatch,
  getState: () => RootState,
  queuePlayer: ReturnType<typeof Player>
) => {
  // Don't use setInterval because a step could be triggered before previous one terminated
  PLAYER_TIMER = setTimeout(async () => {
    const {
      queue: { position: queuePosition, trackIds },
      tracks: { tracks }
    } = getState();
    if (trackIds.length > 0) {
      const playingPosition = queuePlayer.getPlayingPosition();

      // Detect change
      const nextPosition = _computeNextPosition(
        queuePlayer,
        playingPosition,
        queuePosition
      );

      // Apply change to queue and player
      if (nextPosition >= 0) {
        const nextIndex = nextPosition % trackIds.length;
        const nextTrack = tracks[trackIds[nextIndex]];
        console.debug("Applying play change...", {
          nextPosition,
          nextIndex,
          nextTrack
        });
        dispatch(setQueuePosition(nextPosition));
        const [color] = await Promise.all([
          pickColor(nextTrack.album.cover_small),
          queuePlayer.play(nextPosition, nextTrack.preview, 0)
        ]);
        dispatch(setRoomColor(color));
      }

      // Refresh player track percent
      dispatch(setPlayerTrackPercent(queuePlayer.getTrackPercent()));
      _installTimer(dispatch, getState, queuePlayer);
    } else {
      // Last track has been removed from queue by user
      console.debug("No more tracks in queue...");
      dispatch(stopPlayer());
    }
  }, 250);
};

export const startPlayer = (): AsyncAction => async (
  dispatch,
  getState,
  { queuePlayer }
) => {
  if (!PLAYER_TIMER) {
    _installTimer(dispatch, getState, queuePlayer);
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
    clearTimeout(PLAYER_TIMER);
    PLAYER_TIMER = null;
    await queuePlayer.stop();
    dispatch(stop());
    dispatch(setPlayerTrackPercent(0));
  }
};

// ------------------------------------------------------------------

export const startPreview = (trackId: string): AsyncAction => async (
  dispatch,
  getState,
  { deezer, previewPlayer }
) => {
  try {
    const state = getState();
    let track = state.tracks.tracks[trackId];
    if (!track) {
      console.debug("Loading track...", { trackId });
      track = await deezer.loadTrack(trackId);
      dispatch(setTracks([track]));
    }
    console.debug("Start previewing...");
    await previewPlayer.play(0, track.preview, 0);
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
  console.debug("Stop previewing...");
  await previewPlayer.stop();
};
