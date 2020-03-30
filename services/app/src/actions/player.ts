import { AsyncAction } from ".";
import { Player } from "../utils/player";

// ------------------------------------------------------------------

const player = Player();

// ------------------------------------------------------------------

export const load = (
  url: string,
  playWhenReady: boolean,
  offset: number
): AsyncAction => async dispatch => {
  await player.load(url);
  if (playWhenReady) {
    player.play(offset);
  }
};

// ------------------------------------------------------------------

export const play = (offset: number): AsyncAction => async dispatch => {
  player.play(offset);
};

export const stop = (): AsyncAction => async dispatch => {
  player.stop();
};
