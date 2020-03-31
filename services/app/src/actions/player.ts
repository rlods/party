import { AsyncAction } from ".";
import { Player } from "../utils/player";

// ------------------------------------------------------------------

const player = Player();

// ------------------------------------------------------------------

export const loadAudio = (
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

export const playAudio = (offset: number): AsyncAction => async dispatch => {
  player.play(offset);
};

export const stopAudio = (): AsyncAction => async dispatch => {
  player.stop();
};
