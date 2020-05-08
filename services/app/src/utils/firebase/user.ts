import * as firebase from "firebase/app";
import "firebase/database";
//
import { UserInfo } from "../users";
import { createOrGetApp, PermissionError } from ".";

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
	let _secret = secret || "";
	let _values: UserInfo = {
		name: "dummy",
		online: false
	};

	const isLocked = () => !_secret;

	const setSecret = (newSecret: string) => {
		console.debug("[Firebase] Setting user secret...", {
			oldSecret: _secret,
			newSecret
		});
		_secret = newSecret;
	};

	const wait = async (): Promise<UserInfo> => {
		try {
			console.debug("[Firebase] Waiting user...");
			const info = await _info.once("value");
			_values = info.val();
			update({}); // to force online status
			return _values;
		} catch (err) {
			throw new Error("user.errors.invalid");
		}
	};

	const subscribeInfo = (cb: (info: UserInfo) => void) => {
		console.debug("[Firebase] Subscribing user...");
		return _info.on("value", (snapshot: firebase.database.DataSnapshot) => {
			const info = snapshot.val() as UserInfo | null;
			if (!info) {
				return;
			}
			cb(info);
		});
	};

	const unsubscribeInfo = (handler: any) => {
		console.debug("[Firebase] Unsubscribing user...");
		_info.off("value", handler);
	};

	const update = async ({ name }: Partial<Pick<UserInfo, "name">>) => {
		console.debug("[Firebase] Initializing user...", { name });
		if (name !== void 0) {
			_values.name = name;
		}
		try {
			await _user.update({
				info: {
					..._values,
					online: true
				},
				secret: _secret,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			});
		} catch (err) {
			throw new PermissionError(err.message);
		}
		installDisconnect();
	};

	const installDisconnect = () => {
		console.debug("[Firebase] Installing user disconnect...");
		_user.onDisconnect().cancel();
		_user.onDisconnect().update({
			info: {
				..._values,
				online: false
			},
			secret: _secret,
			timestamp: firebase.database.ServerValue.TIMESTAMP
		});
	};

	return {
		dbId,
		userId,
		isLocked,
		setSecret,
		wait,
		subscribeInfo,
		unsubscribeInfo,
		update
	};
};
