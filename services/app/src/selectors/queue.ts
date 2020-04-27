import { RootState } from "../reducers";
import { PlayMode } from "../utils/rooms";

// ------------------------------------------------------------------

export const selectQueuePosition = (state: RootState): number =>
	state.room.queue?.position || 0;

export const selectRoomPlaymode = (state: RootState): PlayMode =>
	state.room.queue?.playmode || "default";

export const isRoomPlaying = (state: RootState): boolean =>
	state.room.queue?.playing || false;
