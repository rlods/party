import { AsyncAction } from ".";

// ------------------------------------------------------------------

export const loadAudio = (
  url: string,
  playWhenReady: boolean,
  offset: number
): AsyncAction => async (dispatch, _, { player }) => {
  await player.load(url);
  if (playWhenReady) {
    player.play(offset);
  }
};

// ------------------------------------------------------------------

export const playAudio = (offset: number): AsyncAction => async (
  dispatch,
  _,
  { player }
) => {
  player.play(offset);
};

// ------------------------------------------------------------------

export const stopAudio = (): AsyncAction => async (dispatch, _, { player }) => {
  player.stop();
};
