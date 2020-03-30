import * as firebase from "firebase/app";
import "firebase/database";
//
import firebaseConfig from "../config/firebase";
import { Room as RoomInfo } from "./rooms";
import { User as UserInfo } from "./users";
import { sleep } from ".";

// ------------------------------------------------------------------

type FirebaseCB = (eventType: firebase.database.DataSnapshot) => void;

// ------------------------------------------------------------------

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseDatabase = firebase.database(firebaseApp);

// ------------------------------------------------------------------

const MEMBERS = firebaseDatabase.ref("members");
const ROOMS = firebaseDatabase.ref("rooms");
const USERS = firebaseDatabase.ref("users");

// ------------------------------------------------------------------

export const Room = (id: string, secret?: string) => {
  const _room = ROOMS.child(id);
  const _info = _room.child("info");
  const _members = MEMBERS.child(id);
  let _values: RoomInfo = {
    name: "dummy",
    playlist_id: "",
    timestamp: 0,
    track_id: 0,
    track_position: 0,
    type: "dj"
  };

  const getInfo = () => _values;

  const init = async (values: Pick<RoomInfo, "name">) => {
    subscribeInfo((snapshot: firebase.database.DataSnapshot) => {
      const newValues = snapshot.val();
      if (newValues) {
        _values = newValues;
      }
    });
    await update(values);
  };

  const wait = async (): Promise<RoomInfo> =>
    new Promise((resolve, reject) => {
      _info.once("value", snapshot => {
        const newValues = snapshot.val();
        if (newValues) {
          _values = newValues;
          resolve(_values);
        } else {
          reject(new Error("Room is invalid"));
        }
      });
    });

  const subscribeInfo = (cb: FirebaseCB) => {
    _info.on("value", cb);
  };

  const unsubscribeInfo = (cb: FirebaseCB) => {
    _info.off("value", cb);
  };

  const subscribeMembers = (cbAdded: FirebaseCB, cbRemoved: FirebaseCB) => {
    _members.on("child_added", cbAdded);
    _members.on("child_removed", cbRemoved);
  };

  const unsubscribeMembers = (cbAdded: FirebaseCB, cbRemoved: FirebaseCB) => {
    _members.off("child_added", cbAdded);
    _members.off("child_removed", cbRemoved);
  };

  const update = async ({
    name,
    playlist_id,
    track_id,
    track_position,
    type
  }: Partial<
    Pick<
      RoomInfo,
      "name" | "playlist_id" | "track_id" | "track_position" | "type"
    >
  >) => {
    if (name !== void 0) {
      _values.name = name;
    }
    if (playlist_id !== void 0) {
      _values.playlist_id = playlist_id;
    }
    if (track_id !== void 0) {
      _values.track_id = track_id;
    }
    if (track_position !== void 0) {
      _values.track_position = track_position;
    }
    if (type !== void 0) {
      _values.type = type;
    }
    await _room.set({
      info: {
        ..._values,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      },
      secret
    });
  };

  return {
    getInfo,
    id,
    init,
    wait,
    subscribeInfo,
    subscribeMembers,
    unsubscribeInfo,
    unsubscribeMembers,
    update
  };
};

// ------------------------------------------------------------------

export const User = (id: string, secret?: string) => {
  const _user = USERS.child(id);
  const _info = _user.child("info");
  let _membership: firebase.database.Reference | null = null;
  let _values = {
    name: "dummy",
    online: false,
    room_id: "",
    status: "",
    timestamp: 0
  };

  const getInfo = () => _values;

  const init = async (values: Pick<UserInfo, "name">) => {
    subscribeInfo((snapshot: firebase.database.DataSnapshot) => {
      const newValues = snapshot.val();
      if (newValues) {
        _values = newValues;
      }
    });
    await update(values);
  };

  const wait = async (): Promise<UserInfo> =>
    new Promise((resolve, reject) => {
      _info.once("value", snapshot => {
        const newValues = snapshot.val();
        if (newValues) {
          _values = newValues;
          resolve(_values);
        } else {
          reject(new Error("User is invalid"));
        }
      });
    });

  const subscribeInfo = (cb: FirebaseCB) => {
    _info.on("value", cb);
  };

  const unsubscribeInfo = (cb: FirebaseCB) => {
    _info.off("value", cb);
  };

  const update = async ({
    name,
    room_id
  }: Partial<Pick<UserInfo, "name" | "room_id">>) => {
    if (name !== void 0) {
      _values.name = name;
    }
    if (room_id !== void 0) {
      _values.room_id = room_id;
    }
    await _user.set({
      info: {
        ..._values,
        online: true,
        status: "online",
        timestamp: firebase.database.ServerValue.TIMESTAMP
      },
      secret
    });
    installDisconnect();
  };

  const installDisconnect = () => {
    _user.onDisconnect().cancel();
    _user.onDisconnect().set({
      info: {
        ..._values,
        online: false,
        room_id: "",
        status: "disconnected",
        timestamp: firebase.database.ServerValue.TIMESTAMP
      },
      secret
    });
  };

  const enter = async (room: ReturnType<typeof Room>) => {
    if (_membership) {
      await _membership.remove();
      _membership = null;
    }
    await update({
      room_id: room.id
    });
    _membership = MEMBERS.child(room.id).child(id);
    _membership.onDisconnect().remove();
    await _membership.set({
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  };

  const exit = async () => {
    if (_membership) {
      await _membership.remove();
      _membership = null;
    }
    await update({
      room_id: ""
    });
  };

  return {
    id,
    enter,
    exit,
    init,
    wait,
    subscribeInfo,
    unsubscribeInfo,
    update,
    getInfo
  };
};

// ------------------------------------------------------------------

export const Party = (id: string, room: ReturnType<typeof Room>) => {
  const _members: string[] = [];
  const _users: { [id: string]: ReturnType<typeof User> } = {};
  let _info = {
    name: "",
    playlist_id: "",
    track_id: 0,
    track_position: 0,
    timestamp: 0,
    type: "dj"
  };

  const _onAdded = (added: firebase.database.DataSnapshot) => {
    const userId = added.key;
    if (userId) {
      const index = _members.indexOf(userId);
      if (index === -1) {
        _members.push(userId);
        _users[userId] = User(userId);
        _log();
      }
    }
  };

  const _onRemoved = (removed: firebase.database.DataSnapshot) => {
    const userId = removed.key;
    if (userId) {
      const index = _members.indexOf(userId);
      if (index !== -1) {
        _members.splice(index, 1);
        delete _users[userId];
        _log();
      }
    }
  };

  const _onRoomInfo = (snapshot: firebase.database.DataSnapshot) => {
    const newValues = snapshot.val() as RoomInfo | null;
    if (newValues) {
      _info = newValues;
      _log();
    }
  };

  const _log = () => {
    console.log(
      `PARTY ${id} room=${_info.name} type=${_info.type} playlist=${_info.playlist_id}/${_info.track_id}/${_info.track_position} members=${_members}`
    );
  };

  const init = () => {
    room.subscribeInfo(_onRoomInfo);
    room.subscribeMembers(_onAdded, _onRemoved);
  };

  const terminate = () => {
    room.unsubscribeInfo(_onRoomInfo);
    room.unsubscribeMembers(_onAdded, _onRemoved);
  };

  return {
    init,
    terminate
  };
};

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

export const testRoom = async () => {
  const room = Room("r1", "rs1");
  await room.init({ name: "R1" });
  room.subscribeInfo(info => console.log("ROOM", info.val()));
  room.subscribeMembers(
    members => console.log("ADDED", members.key),
    members => console.log("REMOVED", members.key)
  );
  await room.init({ name: "R1" });
  await sleep(1000);
  await room.update({
    name: "R1b",
    playlist_id: "42",
    track_id: 43,
    track_position: 44
  });
};

export const testUser = async () => {
  const user = User("u1", "us1");
  user.subscribeInfo(info => console.log("USER", info.val()));
  await user.init({ name: "U1" });
  await sleep(1000);
  await user.update({ name: "U1b" });
};

export const testParty = async () => {
  const room1 = Room("r1", "rs1");
  room1.init({ name: "R1" });
  const room2 = Room("r2", "rs2");
  room2.init({ name: "R2" });
  const user1 = User("u1", "us1");
  user1.init({ name: "U1" });
  const user2 = User("u2", "us2");
  user2.init({ name: "U2" });

  await sleep(2000);

  const party1 = Party("P1", room1);
  party1.init();
  const party2 = Party("P2", room2);
  party2.init();

  await sleep(1000);
  user1.enter(room1);
  await sleep(1000);
  user2.enter(room1);
  await sleep(1000);
  user1.enter(room2);
  await sleep(1000);
  user1.exit();
  await sleep(1000);
  user1.enter(room1);
};

export const test = () => {
  // testRoom();
  // testUser();
  // testParty();
};
