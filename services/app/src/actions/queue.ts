import { createAction, AsyncAction } from ".";

// ------------------------------------------------------------------

export type QueueAction =
  | ReturnType<typeof clearQueue>
  | ReturnType<typeof appendInQueue>
  | ReturnType<typeof removeFromQueue>
  | ReturnType<typeof setQueuePosition>;

export const clearQueue = () => createAction("queue/RESET");

export const appendInQueue = (trackIds: string[]) =>
  createAction("queue/PUSH", trackIds);

export const removeFromQueue = (position: number) =>
  createAction("queue/REMOVE", position);

export const setQueuePosition = (position: number) =>
  createAction("queue/SET_POSITION", position);

// ------------------------------------------------------------------

export const moveBackward = (): AsyncAction => async (dispatch, getState) => {
  const {
    queue: { position, trackIds }
  } = getState();
  if (trackIds.length > 0) {
    dispatch(
      setQueuePosition(position > 0 ? position - 1 : trackIds.length - 1)
    );
  }
};

export const moveForward = (): AsyncAction => async (dispatch, getState) => {
  const {
    queue: { position, trackIds }
  } = getState();
  if (trackIds.length > 0) {
    dispatch(setQueuePosition((position + 1) % trackIds.length));
  }
};
