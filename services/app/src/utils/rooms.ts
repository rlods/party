export type RoomInfo = {
  name: string;
  queue?: RoomQueue;
  queue_position: number;
  timestamp: number;
};

export type RoomAccess = {
  id: string;
  secret: string;
};

export type RoomQueue = {
  [index: string]: {
    id: string;
    type: string;
  };
};

// ------------------------------------------------------------------

export const createSharingUrl = (id: string) =>
  `${window.location.origin}/#/room/${id}`;
