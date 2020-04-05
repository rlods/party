import { createAction, AsyncAction } from ".";
import { RoomQueue } from "../utils/rooms";
import { displayError } from "./messages";
import { lockRoom } from "./rooms";
import { MediaAccess, ProviderType } from "../utils/medias";
import { extractErrorMessage } from "../utils/messages";

// ------------------------------------------------------------------

export type QueueAction = ReturnType<typeof setQueue>;

export const setQueue = (
  medias: MediaAccess[],
  playing: boolean,
  position: number
) => createAction("queue/SET", { medias, playing, position });

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
      dispatch(displayError(extractErrorMessage(err)));
      dispatch(lockRoom());
    }
  } else {
    dispatch(displayError("rooms.error.locked"));
  }
};

export const appendInQueue = (
  provider: ProviderType,
  trackIds: string[]
): AsyncAction => async (dispatch, getState) => {
  const {
    rooms: { room },
  } = getState();
  if (room && !room.isLocked()) {
    if (trackIds.length > 0) {
      const {
        queue: { medias: queueMedias },
      } = getState();
      try {
        console.debug("Appending queue...", { trackIds });
        const queue: RoomQueue = {};
        [...queueMedias.map((media) => media.id), ...trackIds].forEach(
          (id, index) => {
            queue[index] = {
              id,
              provider,
              type: "track",
            };
          }
        );
        await room.update({ queue });
      } catch (err) {
        dispatch(displayError(extractErrorMessage(err)));
        dispatch(lockRoom());
      }
    }
  } else {
    dispatch(displayError("rooms.error.locked"));
  }
};

export const removeFromQueue = (index: number): AsyncAction => async (
  dispatch,
  getState
) => {
  const {
    queue: { medias: queueMedias, position },
    rooms: { room },
  } = getState();
  if (room && !room.isLocked()) {
    if (index < queueMedias.length) {
      try {
        console.debug("Removing from queue...", { index });
        const oldIndex = position % queueMedias.length;
        const queue: RoomQueue = {};
        const copy = [...queueMedias];
        copy.splice(index, 1);
        copy.forEach((mediaAccess, index) => {
          queue[index] = mediaAccess;
        });
        await room.update({
          queue,
          queue_position: index < oldIndex ? position - 1 : position,
        });
      } catch (err) {
        dispatch(displayError(extractErrorMessage(err)));
        dispatch(lockRoom());
      }
    }
  } else {
    dispatch(displayError("rooms.error.locked"));
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
        dispatch(displayError(extractErrorMessage(err)));
        dispatch(lockRoom());
      }
    }
  } else {
    dispatch(displayError("rooms.error.locked"));
  }
};

// ------------------------------------------------------------------

export const moveBackward = (): AsyncAction => async (dispatch, getState) => {
  const {
    queue: { medias: queueMedias, position },
  } = getState();
  if (queueMedias.length > 0) {
    console.debug("Moving backward...");
    dispatch(
      setQueuePosition(position > 0 ? position - 1 : queueMedias.length - 1)
    );
  }
};

export const moveForward = (): AsyncAction => async (dispatch, getState) => {
  const {
    queue: { medias: queueMedias, position },
  } = getState();
  if (queueMedias.length > 0) {
    console.debug("Moving forward...");
    dispatch(setQueuePosition(position + 1));
  }
};
