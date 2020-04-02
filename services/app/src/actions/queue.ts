import { createAction, AsyncAction } from ".";

// ------------------------------------------------------------------

export type QueueAction =
  | ReturnType<typeof clearQueue>
  | ReturnType<typeof pushTracks>
  | ReturnType<typeof removeTrack>
  | ReturnType<typeof setPosition>;

export const clearQueue = () => createAction("queue/RESET");

export const pushTracks = (trackIds: string[]) =>
  createAction("queue/PUSH", trackIds);

export const removeTrack = (position: number) =>
  createAction("queue/REMOVE", position);

export const setPosition = (position: number) =>
  createAction("queue/SET_POSITION", position);

// ------------------------------------------------------------------

export const moveBackward = (): AsyncAction => async (dispatch, getState) => {
  const {
    queue: { position, trackIds }
  } = getState();
  if (trackIds.length > 0) {
    dispatch(setPosition(position > 0 ? position - 1 : trackIds.length - 1));
  }
};

export const moveForward = (): AsyncAction => async (dispatch, getState) => {
  const {
    queue: { position, trackIds }
  } = getState();
  if (trackIds.length > 0) {
    dispatch(setPosition((position + 1) % trackIds.length));
  }
};
