import { createAction, AsyncAction } from ".";
import { RoomQueue } from "../utils/rooms";
import { displayError } from "./messages";
import { lockRoom } from "./rooms";

// ------------------------------------------------------------------

export type QueueAction = ReturnType<typeof setQueue>;

export const setQueue = (trackIds: string[], position: number) =>
  createAction("queue/SET", { position, trackIds });

// ------------------------------------------------------------------

export const clearQueue = (): AsyncAction => async (dispatch, getState) => {
  const {
    rooms: { room }
  } = getState();
  if (room && !room.isLocked()) {
    try {
      console.log("Clearing queue...");
      await room.update({ queue: {}, queue_position: -1 });
    } catch (err) {
      dispatch(displayError("Cannot clear queue"));
      dispatch(lockRoom());
    }
  } else {
    dispatch(displayError("Room is locked"));
  }
};

export const appendInQueue = (trackIds: string[]): AsyncAction => async (
  dispatch,
  getState
) => {
  const {
    rooms: { room }
  } = getState();
  if (room && !room.isLocked() && trackIds.length > 0) {
    try {
      console.log("Appending queue...", { trackIds });
      const queue: RoomQueue = {};
      [...getState().queue.trackIds, ...trackIds].forEach((id, index) => {
        queue[index] = {
          id,
          type: "deezer"
        };
      });
      await room.update({ queue });
    } catch (err) {
      dispatch(displayError("Cannot append in queue"));
      dispatch(lockRoom());
    }
  } else {
    dispatch(displayError("Room is locked"));
  }
};

export const removeFromQueue = (position: number): AsyncAction => async (
  dispatch,
  getState
) => {
  const {
    queue: { position: oldPosition },
    rooms: { room }
  } = getState();
  if (room && !room.isLocked()) {
    try {
      console.log("Removing from queue...", { position });
      const queue: RoomQueue = {};
      const copy = [...getState().queue.trackIds];
      copy.splice(position, 1);
      copy.forEach((id, index) => {
        queue[index] = {
          id,
          type: "deezer"
        };
      });
      await room.update({
        queue,
        queue_position: position < oldPosition ? oldPosition - 1 : oldPosition
      });
    } catch (err) {
      dispatch(displayError("Cannot remove from queue"));
      dispatch(lockRoom());
    }
  } else {
    dispatch(displayError("Room is locked"));
  }
};

export const setQueuePosition = (position: number): AsyncAction => async (
  dispatch,
  getState
) => {
  const {
    rooms: { room }
  } = getState();
  if (room && !room.isLocked()) {
    try {
      console.log("Set queue position...", { position });
      await room.update({ queue_position: position });
    } catch (err) {
      dispatch(displayError("Cannot remove from queue"));
      dispatch(lockRoom());
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
