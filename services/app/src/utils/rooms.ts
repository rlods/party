import { ContainerType } from "./containers";

export type Room = {
  container_id: string;
  container_type: ContainerType;
  name: string;
  timestamp: number;
  track_id: number;
  track_position: number;
  type: string;
};

export type Rooms = { [id: string]: Room };

export const createSharingUrl = (id: string) =>
  `${window.location.origin}/#/room/${id}`;
