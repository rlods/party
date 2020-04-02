export type User = {
  name: string;
  online: boolean;
  room_id: string;
  status: string;
  timestamp: number;
};

export type Users = { [id: string]: User };

export type UserAccess = {
  id: string;
  secret: string;
};

// ------------------------------------------------------------------

export const loadUserAccess = (): UserAccess => {
  const res: UserAccess = {
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
        console.log("Loaded user access: ", res);
      }
    } catch (err) {}
  }
  return res;
};

export const saveUserAccess = ({ id, secret }: UserAccess) => {
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
