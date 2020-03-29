export type Room = {
  name: string;
  playlist_id: string;
  track_id: number;
  track_position: number;
  timestamp: number;
  type: string;
};

export type Rooms = { [id: string]: Room };
