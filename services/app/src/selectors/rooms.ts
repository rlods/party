import { RootState } from "../reducers";

export const extractRoom = (state: RootState) => state.rooms.room_info;

export const isRoomLoaded = (state: RootState) => !!state.rooms.room;

export const isRoomLocked = (state: RootState) =>
  !state.rooms.room_access.secret;
