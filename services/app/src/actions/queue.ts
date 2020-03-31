import { createAction } from ".";

// ------------------------------------------------------------------

export type QueueAction =
  | ReturnType<typeof pushTrack>
  | ReturnType<typeof removeTrack>
  | ReturnType<typeof clearQueue>;

export const pushTrack = (trackId: string) =>
  createAction("queue/PUSH", trackId);

export const removeTrack = (trackId: string) =>
  createAction("queue/REMOVE", trackId);

export const clearQueue = () => createAction("queue/RESET");
