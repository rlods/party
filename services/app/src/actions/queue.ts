import { createAction, AsyncAction } from ".";
import { getCurrentRoom } from "../utils/firebase";
import { RoomQueue } from "../utils/rooms";
import { displayError } from "./messages";

// ------------------------------------------------------------------

export type QueueAction =
  | ReturnType<typeof _clearQueue>
  | ReturnType<typeof _appendInQueue>
  | ReturnType<typeof _removeFromQueue>
  | ReturnType<typeof _setQueuePosition>;

const _clearQueue = () => createAction("queue/RESET");

const _appendInQueue = (trackIds: string[]) =>
  createAction("queue/PUSH", trackIds);

const _removeFromQueue = (position: number) =>
  createAction("queue/REMOVE", position);

const _setQueuePosition = (position: number) =>
  createAction("queue/SET_POSITION", position);

// ------------------------------------------------------------------

export const clearQueue = (): AsyncAction => async (dispatch, getState) => {
  const room = getCurrentRoom();
  if (room && !room.isLocked()) {
    try {
      await room.update({ queue: {}, queue_position: -1 });
      dispatch(_clearQueue());
    } catch (err) {
      dispatch(displayError("Cannot clear queue", err));
    }
  } else {
    dispatch(displayError("Room is locked"));
  }
};

export const appendInQueue = (trackIds: string[]): AsyncAction => async (
  dispatch,
  getState
) => {
  const room = getCurrentRoom();
  if (room && !room.isLocked()) {
    try {
      const queue: RoomQueue = {};
      [...getState().queue.trackIds, ...trackIds].forEach((id, index) => {
        queue[index] = {
          id,
          type: "deezer"
        };
      });
      await room.update({ queue });
      dispatch(_appendInQueue(trackIds));
    } catch (err) {
      dispatch(displayError("Cannot append in queue", err));
    }
  } else {
    dispatch(displayError("Room is locked"));
  }
};

export const removeFromQueue = (position: number): AsyncAction => async (
  dispatch,
  getState
) => {
  const room = getCurrentRoom();
  if (room && !room.isLocked()) {
    try {
      const queue: RoomQueue = {};
      const copy = [...getState().queue.trackIds];
      copy.splice(position, 1);
      copy.forEach((id, index) => {
        queue[index] = {
          id,
          type: "deezer"
        };
      });
      await room.update({ queue });
      dispatch(_removeFromQueue(position));
    } catch (err) {
      dispatch(displayError("Cannot remove from queue", err));
    }
  } else {
    dispatch(displayError("Room is locked"));
  }
};

export const setQueuePosition = (position: number): AsyncAction => async (
  dispatch,
  getState
) => {
  const room = getCurrentRoom();
  if (room && !room.isLocked()) {
    try {
      await room.update({ queue_position: position });
      dispatch(_setQueuePosition(position));
    } catch (err) {
      dispatch(displayError("Cannot remove from queue", err));
    }
  } else {
    dispatch(displayError("Room is locked"));
  }
};

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
