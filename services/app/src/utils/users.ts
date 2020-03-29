export type User = {
  name: string;
  online: boolean;
  room_id: string;
  status: string;
  timestamp: number;
};

export type Users = { [id: string]: User };
