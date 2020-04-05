import * as firebase from "firebase/app";
import "firebase/database";
//
import firebaseConfig from "../config/firebase";
import { RoomInfo } from "./rooms";
import { UserInfo } from "./users";
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

export const FirebaseRoom = (id: string, secret?: string) => {
  const _room = ROOMS.child(id);
  const _info = _room.child("info");
  const _members = MEMBERS.child(id);
  let _secret = secret || "";
  console.debug("INIT SECRET", _secret);
  let _values: RoomInfo = {
    name: "dummy",
    playing: false,
    queue: {},
    queue_position: 0,
    timestamp: 0,
    type: "dj",
  };

  const getInfo = () => _values;

  const isLocked = () => !_secret;

  const setSecret = (newSecret: string) => {
    console.debug("SETTING SECRET", newSecret);
    _secret = newSecret;
  };

  const wait = async (): Promise<RoomInfo> =>
    new Promise((resolve, reject) => {
      _info.once("value", (snapshot) => {
        const newValues = snapshot.val();
        if (newValues) {
          _values = newValues;
          resolve(_values);
        } else {
          reject(new Error("rooms.errors.invalid"));
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
    playing,
    queue,
    queue_position,
  }: Partial<
    Pick<RoomInfo, "name" | "playing" | "queue" | "queue_position">
  >) => {
    if (name !== void 0) {
      _values.name = name;
    }
    if (playing !== void 0) {
      _values.playing = playing;
    }
    if (queue !== void 0) {
      _values.queue = queue;
    }
    if (queue_position !== void 0) {
      _values.queue_position = queue_position;
    }
    await _room.set({
      info: {
        ..._values,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      },
      secret: _secret,
    });
  };

  return {
    getInfo,
    id,
    isLocked,
    setSecret,
    wait,
    subscribeInfo,
    subscribeMembers,
    unsubscribeInfo,
    unsubscribeMembers,
    update,
  };
};

// ------------------------------------------------------------------

export const FirebaseUser = (id: string, secret?: string) => {
  const _user = USERS.child(id);
  const _info = _user.child("info");
  let _membership: firebase.database.Reference | null = null;
  let _secret = secret || "";
  let _values: UserInfo = {
    name: "dummy",
    online: false,
    room_id: "",
    status: "",
    timestamp: 0,
  };

  const getInfo = () => _values;

  const isLocked = () => !_secret;

  const setSecret = (newSecret: string) => {
    _secret = newSecret;
  };

  const wait = async (): Promise<UserInfo> =>
    new Promise((resolve, reject) => {
      _info.once("value", (snapshot) => {
        const newValues = snapshot.val();
        if (newValues) {
          _values = newValues;
          resolve(_values);
        } else {
          reject(new Error("users.errors.invalid"));
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
    room_id,
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
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      },
      secret: _secret,
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
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      },
      secret: _secret,
    });
  };

  const enter = async (room: ReturnType<typeof FirebaseRoom>) => {
    if (_membership) {
      await _membership.remove();
      _membership = null;
    }
    await update({
      room_id: room.id,
    });
    _membership = MEMBERS.child(room.id).child(id);
    _membership.onDisconnect().remove();
    await _membership.set({
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  const exit = async () => {
    if (_membership) {
      await _membership.remove();
      _membership = null;
    }
    await update({
      room_id: "",
    });
  };

  return {
    id,
    enter,
    exit,
    isLocked,
    setSecret,
    wait,
    subscribeInfo,
    unsubscribeInfo,
    update,
    getInfo,
  };
};

// ------------------------------------------------------------------

export const FirebaseParty = (
  id: string,
  room: ReturnType<typeof FirebaseRoom>
) => {
  const _members: string[] = [];
  const _users: { [id: string]: ReturnType<typeof FirebaseUser> } = {};
  let _info: RoomInfo = {
    name: "",
    playing: false,
    queue: {},
    queue_position: 0,
    timestamp: 0,
    type: "dj",
  };

  const _onAdded = (added: firebase.database.DataSnapshot) => {
    const userId = added.key;
    if (userId) {
      const index = _members.indexOf(userId);
      if (index === -1) {
        _members.push(userId);
        _users[userId] = FirebaseUser(userId);
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
    console.debug("PARTY", {
      _info,
      _members,
    });
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
    terminate,
  };
};

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

export const testRoom = async () => {
  const room = FirebaseRoom("r1", "rs1");
  await room.update({ name: "R1" });
  room.subscribeInfo((info) => console.debug("ROOM", info.val()));
  room.subscribeMembers(
    (members) => console.debug("ADDED", members.key),
    (members) => console.debug("REMOVED", members.key)
  );
  await room.update({ name: "R1" });
  await sleep(1000);
  await room.update({
    name: "R1b",
    queue: {},
    queue_position: 0,
  });
};

export const testUser = async () => {
  const user = FirebaseUser("u1", "us1");
  user.subscribeInfo((info) => console.debug("USER", info.val()));
  await user.update({ name: "U1" });
  await sleep(1000);
  await user.update({ name: "U1b" });
};

export const testParty = async () => {
  const room1 = FirebaseRoom("r1", "rs1");
  await room1.update({ name: "R1" });
  const room2 = FirebaseRoom("r2", "rs2");
  await room2.update({ name: "R2" });
  const user1 = FirebaseUser("u1", "us1");
  await user1.update({ name: "U1" });
  const user2 = FirebaseUser("u2", "us2");
  await user2.update({ name: "U2" });

  await sleep(2000);

  const party1 = FirebaseParty("P1", room1);
  await party1.init();
  const party2 = FirebaseParty("P2", room2);
  await party2.init();

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
