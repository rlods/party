import { RootState } from "../reducers";

// ------------------------------------------------------------------

export const selectRoomName = (state: RootState): string =>
	state.room.info?.name || "";

export const isRoomLoaded = (state: RootState): boolean => !!state.room._fbRoom;

export const isRoomLocked = (state: RootState): boolean =>
	!state.room.access.secret;
