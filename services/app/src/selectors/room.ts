import { RootState } from "../reducers";

// ------------------------------------------------------------------

export const selectExtraDecoded = (state: RootState): any =>
	state.room.extraDecoded;

export const selectRoomName = (state: RootState): string =>
	state.room.info?.name || "";

export const isRoomLoaded = (state: RootState): boolean => !!state.room._fbRoom;

export const isRoomLocked = (state: RootState): boolean =>
	!state.room.access.secret;
