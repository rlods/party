import { createAction, AsyncAction } from ".";
import { RoomQueue } from "../utils/rooms";
import { displayError } from "./messages";
import { lockRoom } from "./rooms";

// ------------------------------------------------------------------

export type QueueAction = ReturnType<typeof setQueue>;

export const setQueue = (
  playing: boolean,
  trackIds: string[],
  position: number
) => createAction("queue/SET", { playing, position, trackIds });

// ------------------------------------------------------------------

export const clearQueue = (): AsyncAction => async (dispatch, getState) => {
  const {
    rooms: { room },
  } = getState();
  if (room && !room.isLocked()) {
    try {
      console.debug("Clearing queue...");
      await room.update({ queue: {}, queue_position: 0 });
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
    rooms: { room },
  } = getState();
  if (room && !room.isLocked()) {
    if (trackIds.length > 0) {
      try {
        console.debug("Appending queue...", { trackIds });
        const queue: RoomQueue = {};
        [...getState().queue.trackIds, ...trackIds].forEach((id, index) => {
          queue[index] = {
            id,
            type: "deezer",
          };
        });
        await room.update({ queue });
      } catch (err) {
        dispatch(displayError("Cannot append in queue"));
        dispatch(lockRoom());
      }
    }
  } else {
    dispatch(displayError("Room is locked"));
  }
};

export const removeFromQueue = (index: number): AsyncAction => async (
  dispatch,
  getState
) => {
  const {
    queue: { trackIds, position },
    rooms: { room },
  } = getState();
  if (room && !room.isLocked()) {
    if (index < trackIds.length) {
      try {
        console.debug("Removing from queue...", { index });
        const oldIndex = position % trackIds.length;
        const queue: RoomQueue = {};
        const copy = [...getState().queue.trackIds];
        copy.splice(index, 1);
        copy.forEach((id, index) => {
          queue[index] = {
            id,
            type: "deezer",
          };
        });
        await room.update({
          queue,
          queue_position: index < oldIndex ? position - 1 : position,
        });
      } catch (err) {
        dispatch(displayError("Cannot remove from queue"));
        dispatch(lockRoom());
      }
    }
  } else {
    dispatch(displayError("Room is locked"));
  }
};

export const setQueuePosition = (newPosition: number): AsyncAction => async (
  dispatch,
  getState
) => {
  const {
    queue: { position: oldPosition },
    rooms: { room },
  } = getState();
  if (room && !room.isLocked()) {
    if (oldPosition !== newPosition) {
      try {
        console.debug("Set queue position...", {
          oldPosition,
          newPosition,
        });
        await room.update({ queue_position: newPosition });
      } catch (err) {
        dispatch(displayError("Cannot set queue position"));
        dispatch(lockRoom());
      }
    }
  } else {
    dispatch(displayError("Room is locked"));
  }
};

// ------------------------------------------------------------------

export const moveBackward = (): AsyncAction => async (dispatch, getState) => {
  const {
    queue: { position, trackIds },
  } = getState();
  if (trackIds.length > 0) {
    console.debug("Moving backward...");
    dispatch(
      setQueuePosition(position > 0 ? position - 1 : trackIds.length - 1)
    );
  }
};

export const moveForward = (): AsyncAction => async (dispatch, getState) => {
  const {
    queue: { position, trackIds },
  } = getState();
  if (trackIds.length > 0) {
    console.debug("Moving forward...");
    dispatch(setQueuePosition(position + 1));
  }
};
