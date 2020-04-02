export type Room = {
  name: string;
  timestamp: number;
  track_id: number;
  track_position: number;
  type: string;
};

export type Rooms = { [id: string]: Room };

export type RoomAccess = {
  id: string;
  secret: string;
};

// ------------------------------------------------------------------

export const createSharingUrl = (id: string) =>
  `${window.location.origin}/#/room/${id}`;

// ------------------------------------------------------------------

export const loadRoomAccess = (): RoomAccess => {
  const res: RoomAccess = {
    id: "",
    secret: ""
  };
  const s = localStorage.getItem("R");
  if (s) {
    try {
      const d = JSON.parse(atob(s));
      if (typeof d.i === "string" && typeof d.s === "string") {
        res.id = d.i;
        res.secret = d.s;
        console.log("Loaded room access: ", res);
      }
    } catch (err) {}
  }
  return res;
};

export const saveRoomAccess = ({ id, secret }: RoomAccess) => {
  localStorage.setItem(
    "R",
    btoa(
      JSON.stringify({
        i: id,
        s: secret
      })
    )
  );
};
