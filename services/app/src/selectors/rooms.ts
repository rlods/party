import { RootState } from "../reducers";
import { Room } from "../utils/rooms";

export const extractRoom = (state: RootState, id: string): Room | null => {
  const room = state.rooms.rooms[id];
  if (!room) {
    return null;
  }
  return room;
};

export const isRoomLocked = (state: RootState) =>
  !state.rooms.room_access.secret;
