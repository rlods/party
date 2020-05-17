import { RootState } from "../reducers";

// ------------------------------------------------------------------

export const selectExtraDecoded = (state: RootState): any =>
	state.room.data.extraDecoded;

export const selectRoomName = (state: RootState): string =>
	state.room.data.info?.name || "";

export const isRoomLoaded = (state: RootState): boolean =>
	!!state.room.data.firebaseRoom;

export const isRoomLocked = (state: RootState): boolean =>
	!state.room.access.secret;
