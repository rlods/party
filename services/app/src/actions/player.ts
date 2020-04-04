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

let PLAYER_TIMER1: NodeJS.Timeout | null = null;
let PLAYER_TIMER2: NodeJS.Timeout | null = null;

const _computeNextPosition = (
  queuePlayer: ReturnType<typeof Player>,
  queueTrackPosition: number,
  trackIds: string[]
) => {
  let nextPosition = -1;
  const playingTrackID = queuePlayer.getPlayingTrackID();
  const playingTrackPosition = queuePlayer.getPlayingTrackPosition();
  if (playingTrackPosition !== queueTrackPosition) {
    if (queuePlayer.isPlaying()) {
      // User has clicked an other track or added/removed a track in queue
      nextPosition = queueTrackPosition;
    } else {
      // Not playing which means previous track has terminated
      nextPosition =
        playingTrackPosition >= 0 ? playingTrackPosition : queueTrackPosition;
    }
  } else if (
    playingTrackID !== trackIds[queueTrackPosition % trackIds.length]
  ) {
    // User has deleted playing track
    nextPosition = queueTrackPosition;
  }
  return nextPosition;
};

const _installTimer1 = (
  dispatch: Dispatch,
  getState: () => RootState,
  queuePlayer: ReturnType<typeof Player>
) => {
  // Don't use setInterval because a step could be triggered before previous one terminated
  PLAYER_TIMER1 = setTimeout(async () => {
    const {
      queue: { position, trackIds },
      tracks: { tracks },
    } = getState();
    if (trackIds.length > 0) {
      // Detect and apply change to queue and player
      const nextTrackPosition = _computeNextPosition(
        queuePlayer,
        position,
        trackIds
      );
      if (nextTrackPosition >= 0) {
        const nextIndex = nextTrackPosition % trackIds.length;
        const nextTrack = tracks[trackIds[nextIndex]];
        console.debug("Detected play change...", {
          nextIndex,
          nextTrack,
          nextTrackPosition,
        });
        dispatch(setQueuePosition(nextTrackPosition));
        const [color] = await Promise.all([
          pickColor(nextTrack.album.cover_small),
          queuePlayer.play(
            nextTrackPosition,
            nextTrack.id.toString(),
            nextTrack.preview,
            0
          ),
        ]);
        dispatch(setRoomColor(color));
      }

      // Reschedule time
      _installTimer1(dispatch, getState, queuePlayer);
    } else {
      // Last track has been removed from queue by user
      console.debug("No more tracks in queue...");
      dispatch(stopPlayer());
    }
  }, 250);
};

const _installTimer2 = (
  dispatch: Dispatch,
  getState: () => RootState,
  queuePlayer: ReturnType<typeof Player>
) => {
  // Don't use setInterval because a step could be triggered before previous one terminated
  PLAYER_TIMER2 = setTimeout(() => {
    const {
      queue: { trackIds },
    } = getState();
    if (trackIds.length > 0) {
      // Refresh player track percent
      dispatch(setPlayerTrackPercent(queuePlayer.getPlayingTrackPercent()));

      // Reschedule time
      _installTimer2(dispatch, getState, queuePlayer);
    }
  }, 250); // Must do very few operation because called very often (if we put less it creates blink on mobile when playing & scrolling)
};

export const startPlayer = (): AsyncAction => async (
  dispatch,
  getState,
  { queuePlayer }
) => {
  if (!PLAYER_TIMER1 && !PLAYER_TIMER2) {
    _installTimer1(dispatch, getState, queuePlayer);
    _installTimer2(dispatch, getState, queuePlayer);
    dispatch(start());
  }
};

// ------------------------------------------------------------------

export const stopPlayer = (): AsyncAction => async (
  dispatch,
  _,
  { queuePlayer }
) => {
  if (PLAYER_TIMER1 && PLAYER_TIMER2) {
    clearTimeout(PLAYER_TIMER1);
    PLAYER_TIMER1 = null;
    clearTimeout(PLAYER_TIMER2);
    PLAYER_TIMER2 = null;
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
    await previewPlayer.play(0, track.id.toString(), track.preview, 0);
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
