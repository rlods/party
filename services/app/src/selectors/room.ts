import { RootState } from "../reducers";

export const selectRoom = (state: RootState) => state.room.info;

export const isRoomLoaded = (state: RootState) => !!state.room.room;

export const isRoomLocked = (state: RootState) => !state.room.access.secret;

export const isRoomPlaying = (state: RootState) =>
	null !== state.room.info && state.room.info.playing;
