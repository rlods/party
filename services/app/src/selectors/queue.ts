import { RootState } from "../reducers";
import { PlayMode } from "../utils/rooms";

// ------------------------------------------------------------------

export const selectRoomPlayerMode = (state: RootState): PlayMode =>
	state.room.data.player?.mode || "default";

export const selectRoomPlayerPosition = (state: RootState): number =>
	state.room.data.player?.position || 0;

export const isRoomPlaying = (state: RootState): boolean =>
	state.room.data.player?.playing || false;
