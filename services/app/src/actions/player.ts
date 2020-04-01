import { AsyncAction, createAction } from ".";

// ------------------------------------------------------------------

export type PlayerAction =
  | ReturnType<typeof reset>
  | ReturnType<typeof start>
  | ReturnType<typeof stop>;

export const reset = () => createAction("player/RESET");

export const start = () => createAction("player/START");

export const stop = () => createAction("player/STOP");

// ------------------------------------------------------------------

let PLAYER_TIMER: NodeJS.Timeout | null = null;

export const startPlayer = (): AsyncAction => async (
  dispatch,
  getState,
  { queuePlayer }
) => {
  if (!PLAYER_TIMER) {
    PLAYER_TIMER = setInterval(async () => {
      if (!queuePlayer.isPlaying()) {
        const {
          queue: { position, trackIds },
          tracks
        } = getState();
        if (trackIds.length > 0) {
          console.log("PLAYING", { position });
          await queuePlayer.load(tracks.tracks[trackIds[position]].preview);
          queuePlayer.play(0);
        }
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

    queuePlayer.stop();
    dispatch(stop());
  }
};
