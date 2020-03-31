import { createAction } from ".";

// ------------------------------------------------------------------

export type QueueAction =
  | ReturnType<typeof clearQueue>
  | ReturnType<typeof pushTracks>
  | ReturnType<typeof removeTrack>;

export const clearQueue = () => createAction("queue/RESET");

export const pushTracks = (trackIds: string[]) =>
  createAction("queue/PUSH", trackIds);

export const removeTrack = (trackId: string) =>
  createAction("queue/REMOVE", trackId);
