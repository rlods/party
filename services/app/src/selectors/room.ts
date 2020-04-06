import { RootState } from "../reducers";

export const extractRoom = (state: RootState) => state.room.info;

export const isRoomLoaded = (state: RootState) => !!state.room.room;

export const isRoomLocked = (state: RootState) => !state.room.access.secret;
