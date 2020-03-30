export type User = {
  name: string;
  online: boolean;
  room_id: string;
  status: string;
  timestamp: number;
};

export type Users = { [id: string]: User };

// ------------------------------------------------------------------

export type XXX = {
  id: string;
  secret: string;
};

export const load = (): XXX => {
  const res: XXX = {
    id: "",
    secret: ""
  };
  const s = localStorage.getItem("U");
  if (s) {
    try {
      const d = JSON.parse(atob(s));
      if (typeof d.i === "string" && typeof d.s === "string") {
        res.id = d.i;
        res.secret = d.s;
        console.log("LOADED: ", res);
      }
    } catch (err) {}
  }
  return res;
};

export const save = ({ id, secret }: XXX) => {
  localStorage.setItem(
    "U",
    btoa(
      JSON.stringify({
        i: id,
        s: secret
      })
    )
  );
};
