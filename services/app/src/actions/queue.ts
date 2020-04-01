import { createAction } from ".";

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
