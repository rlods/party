import * as firebase from "firebase/app";
import "firebase/database";
//
import firebaseConfig from "../config/firebase";
import { RoomInfo } from "./rooms";
import { UserInfo } from "./users";

// ------------------------------------------------------------------

type FirebaseCB = (eventType: firebase.database.DataSnapshot) => void;

// ------------------------------------------------------------------

const APPS: {
	[id: string]: {
		app: firebase.app.App;
		database: firebase.database.Database;
		members: firebase.database.Reference;
		rooms: firebase.database.Reference;
		users: firebase.database.Reference;
	};
} = {};

const DEFAULT_APP_ID = firebaseConfig.appIDs[0];

const createOrGetApp = (appId: string = DEFAULT_APP_ID) => {
	let res = APPS[appId];
	if (!res) {
		console.debug("[Firebase] Creating app", { appId });
		const databaseURL = `https://${appId}.firebaseio.com`;
		const app = firebase.initializeApp({ databaseURL });
		const database = firebase.database(app);
		APPS[appId] = res = {
			app,
			database,
			members: database.ref("members"),
			rooms: database.ref("rooms"),
			users: database.ref("users")
		};
	}
	return res;
};

// ------------------------------------------------------------------

export const FirebaseRoom = ({
	id,
	secret
}: {
	id: string;
	secret?: string;
}) => {
	const app = createOrGetApp();
	const _room = app.rooms.child(id);
	const _info = _room.child("info");
	const _members = app.members.child(id);
	let _secret = secret || "";

	const isLocked = () => !_secret;

	const setSecret = (newSecret: string) => {
		console.debug("[Firebase] Setting room secret", {
			oldSecret: _secret,
			newSecret
		});
		_secret = newSecret;
	};

	const wait = async (): Promise<RoomInfo> =>
		new Promise((resolve, reject) => {
			console.debug("[Firebase] Waiting room...");
			_info.once("value", snapshot => {
				const newValues = snapshot.val();
				if (newValues) {
					resolve(newValues);
				} else {
					reject(new Error("rooms.errors.invalid"));
				}
			});
		});

	const subscribe = (cb: FirebaseCB) => {
		console.debug("[Firebase] Subscribing room...");
		return _info.on("value", cb);
	};

	const unsubscribe = (cb: FirebaseCB) => {
		console.debug("[Firebase] Unsubscribing room...");
		_info.off("value", cb);
	};

	const subscribeMembers = (cbAdded: FirebaseCB, cbRemoved: FirebaseCB) => {
		console.debug("[Firebase] Subscribing members...");
		_members.on("child_added", cbAdded);
		_members.on("child_removed", cbRemoved);
	};

	const unsubscribeMembers = (cbAdded: FirebaseCB, cbRemoved: FirebaseCB) => {
		console.debug("[Firebase] Unsubscribing members...");
		_members.off("child_added", cbAdded);
		_members.off("child_removed", cbRemoved);
	};

	const update = async ({
		name,
		playing,
		queue,
		queue_position,
		type
	}: Pick<
		RoomInfo,
		"name" | "playing" | "queue" | "queue_position" | "type"
	>) => {
		console.debug("[Firebase] Updating room...", {
			name,
			playing,
			queue,
			queue_position
		});
		await _room.set({
			info: {
				name,
				playing,
				queue,
				queue_position,
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				type
			},
			secret: _secret
		});
	};

	return {
		id,
		isLocked,
		setSecret,
		wait,
		subscribe,
		subscribeMembers,
		unsubscribe,
		unsubscribeMembers,
		update
	};
};

// ------------------------------------------------------------------

export const FirebaseUser = ({
	id,
	secret
}: {
	id: string;
	secret?: string;
}) => {
	const app = createOrGetApp();
	const _user = app.users.child(id);
	const _info = _user.child("info");
	let _membership: firebase.database.Reference | null = null;
	let _secret = secret || "";
	let _values: UserInfo = {
		name: "dummy",
		online: false,
		room_id: "",
		status: "",
		timestamp: 0
	};

	const isLocked = () => !_secret;

	const setSecret = (newSecret: string) => {
		console.debug("[Firebase] Setting user secret...", {
			oldSecret: _secret,
			newSecret
		});
		_secret = newSecret;
	};

	const wait = async (): Promise<UserInfo> =>
		new Promise((resolve, reject) => {
			console.debug("[Firebase] Waiting user...");
			_info.once("value", snapshot => {
				const newValues = snapshot.val();
				if (newValues) {
					_values = newValues;
					resolve(newValues);
				} else {
					reject(new Error("users.errors.invalid"));
				}
			});
		});

	const subscribe = (cb: FirebaseCB) => {
		console.debug("[Firebase] Subscribing user...");
		return _info.on("value", cb);
	};

	const unsubscribe = (cb: FirebaseCB) => {
		console.debug("[Firebase] Unsubscribing user...");
		_info.off("value", cb);
	};

	const update = async ({
		name,
		room_id
	}: Partial<Pick<UserInfo, "name" | "room_id">>) => {
		console.debug("[Firebase] Updating user...", { name, room_id });
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
			secret: _secret
		});
		installDisconnect();
	};

	const installDisconnect = () => {
		console.debug("[Firebase] Installing user disconnect...");
		_user.onDisconnect().cancel();
		_user.onDisconnect().set({
			info: {
				..._values,
				online: false,
				room_id: "",
				status: "disconnected",
				timestamp: firebase.database.ServerValue.TIMESTAMP
			},
			secret: _secret
		});
	};

	const enter = async (room: ReturnType<typeof FirebaseRoom>) => {
		const app = createOrGetApp();
		if (_membership) {
			await _membership.remove();
			_membership = null;
		}
		await update({
			room_id: room.id
		});
		_membership = app.members.child(room.id).child(id);
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
		isLocked,
		setSecret,
		wait,
		subscribe,
		unsubscribe,
		update
	};
};

// ------------------------------------------------------------------

export const FirebaseParty = ({
	id,
	room
}: {
	id: string;
	room: ReturnType<typeof FirebaseRoom>;
}) => {
	const _members: string[] = [];
	const _users: { [id: string]: ReturnType<typeof FirebaseUser> } = {};
	let _info: RoomInfo = {
		name: "",
		playing: false,
		queue: {},
		queue_position: 0,
		timestamp: 0,
		type: "dj"
	};

	const _onAdded = (added: firebase.database.DataSnapshot) => {
		const userId = added.key;
		if (userId) {
			const index = _members.indexOf(userId);
			if (index === -1) {
				_members.push(userId);
				_users[userId] = FirebaseUser({ id: userId });
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
			_members
		});
	};

	const init = () => {
		room.subscribe(_onRoomInfo);
		room.subscribeMembers(_onAdded, _onRemoved);
	};

	const terminate = () => {
		room.unsubscribe(_onRoomInfo);
		room.unsubscribeMembers(_onAdded, _onRemoved);
	};

	return {
		init,
		terminate
	};
};
