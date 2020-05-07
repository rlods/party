import { RootState } from "../reducers";
import { PlayMode } from "../utils/rooms";

// ------------------------------------------------------------------

export const selectQueuePosition = (state: RootState): number =>
	state.room.data.queue?.position || 0;

export const selectRoomPlaymode = (state: RootState): PlayMode =>
	state.room.data.queue?.playmode || "default";

export const isRoomPlaying = (state: RootState): boolean =>
	state.room.data.queue?.playing || false;
