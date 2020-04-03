import { RootState } from "../reducers";
import { Room } from "../utils/rooms";

export const extractRoom = (state: RootState): Room | null => {
  return state.rooms.room;
};

export const isRoomLocked = (state: RootState) =>
  !state.rooms.room_access.secret;
