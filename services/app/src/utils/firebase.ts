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
		rooms: firebase.database.Reference;
		users: firebase.database.Reference;
	};
} = {};

const createOrGetApp = (dbId: string) => {
	let res = APPS[dbId];
	if (!res) {
		console.debug("[Firebase] Creating app", { dbId });
		const databaseURL = `https://${firebaseConfig.dbPrefix}${dbId}.firebaseio.com`;
		const app = firebase.initializeApp({ databaseURL });
		const database = firebase.database(app);
		APPS[dbId] = res = {
			app,
			database,
			rooms: database.ref("rooms"),
			users: database.ref("users")
		};
	}
	return res;
};

// ------------------------------------------------------------------

export const FirebaseRoom = ({
	dbId,
	roomId,
	secret
}: {
	dbId: string;
	roomId: string;
	secret?: string;
}) => {
	const app = createOrGetApp(dbId);
	const _room = app.rooms.child(roomId);
	const _info = _room.child("info");
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

	// const subscribeMembers = (cbAdded: FirebaseCB, cbRemoved: FirebaseCB) => {
	// 	console.debug("[Firebase] Subscribing members...");
	// 	_members.on("child_added", cbAdded);
	// 	_members.on("child_removed", cbRemoved);
	// };

	// const unsubscribeMembers = (cbAdded: FirebaseCB, cbRemoved: FirebaseCB) => {
	// 	console.debug("[Firebase] Unsubscribing members...");
	// 	_members.off("child_added", cbAdded);
	// 	_members.off("child_removed", cbRemoved);
	// };

	const update = async ({
		extra,
		name,
		playing,
		playmode,
		queue,
		queue_position,
		type
	}: Pick<
		RoomInfo,
		| "extra"
		| "name"
		| "playing"
		| "playmode"
		| "queue"
		| "queue_position"
		| "type"
	>) => {
		console.debug("[Firebase] Updating room...", {
			extra: !!extra,
			name,
			playing,
			playmode,
			queue,
			queue_position
		});
		await _room.set({
			info: {
				extra,
				name,
				playing,
				playmode,
				queue,
				queue_position,
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				type
			},
			secret: _secret
		});
	};

	return {
		dbId,
		roomId,
		isLocked,
		setSecret,
		wait,
		subscribe,
		unsubscribe,
		update
	};
};

// ------------------------------------------------------------------

export const FirebaseUser = ({
	dbId,
	userId,
	secret
}: {
	dbId: string;
	userId: string;
	secret?: string;
}) => {
	const app = createOrGetApp(dbId);
	const _user = app.users.child(userId);
	const _info = _user.child("info");
	// let _membership: firebase.database.Reference | null = null;
	let _secret = secret || "";
	let _values: UserInfo = {
		name: "dummy",
		online: false,
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

	const update = async ({ name }: Partial<Pick<UserInfo, "name">>) => {
		console.debug("[Firebase] Updating user...", { name });
		if (name !== void 0) {
			_values.name = name;
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
				status: "disconnected",
				timestamp: firebase.database.ServerValue.TIMESTAMP
			},
			secret: _secret
		});
	};

	//const enter = async (room: ReturnType<typeof FirebaseRoom>) => {
	//	const app = createOrGetApp();
	//	if (_membership) {
	//		await _membership.remove();
	//		_membership = null;
	//	}
	//	await update({
	//	});
	// 	_membership = app.members.child(room.id).child(id);
	// 	_membership.onDisconnect().remove();
	// 	await _membership.set({
	// 		timestamp: firebase.database.ServerValue.TIMESTAMP
	// 	});
	//};

	//const exit = async () => {
	// if (_membership) {
	// 	await _membership.remove();
	// 	_membership = null;
	// }
	//	await update({
	//		...
	//	});
	//};

	return {
		dbId,
		userId,
		isLocked,
		setSecret,
		wait,
		subscribe,
		unsubscribe,
		update
	};
};
