import { RootState } from "../reducers";

export const selectQueuePosition = (state: RootState) =>
	null !== state.room.info ? state.room.info.queue_position : 0;
