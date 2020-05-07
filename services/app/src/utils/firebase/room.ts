import * as firebase from "firebase/app";
import "firebase/database";
//
import { createOrGetApp } from "./";
import { RoomInfo, RoomQueue } from "../rooms";

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
	const _extra = _room.child("extra");
	const _info = _room.child("info");
	const _queue = _room.child("queue");
	let _secret = secret || "";

	const isLocked = () => !_secret;

	const setSecret = (newSecret: string) => {
		console.debug("[Firebase] Setting room secret", {
			oldSecret: _secret,
			newSecret
		});
		_secret = newSecret;
	};

	const wait = async (): Promise<{
		extra: string;
		info: RoomInfo;
		queue: RoomQueue;
	}> => {
		try {
			console.debug("[Firebase] Waiting room...");
			const [extra, info, queue] = await Promise.all([
				_extra.once("value"),
				_info.once("value"),
				_queue.once("value")
			]);
			return {
				extra: extra.val(),
				info: info.val(),
				queue: queue.val()
			};
		} catch (err) {
			throw new Error("rooms.errors.invalid");
		}
	};

	const subscribeExtra = (cb: (extra: string) => void) => {
		console.debug("[Firebase] Subscribing room extra...");
		return _extra.on(
			"value",
			(snapshot: firebase.database.DataSnapshot) => {
				const extra = snapshot.val() as string | null;
				if (!extra) {
					return;
				}
				cb(extra);
			}
		);
	};

	const subscribeInfo = (cb: (info: RoomInfo) => void) => {
		console.debug("[Firebase] Subscribing room info...");
		return _info.on("value", (snapshot: firebase.database.DataSnapshot) => {
			const info = snapshot.val() as RoomInfo | null;
			if (!info) {
				return;
			}
			cb(info);
		});
	};

	const subscribeQueue = (cb: (info: RoomQueue) => void) => {
		console.debug("[Firebase] Subscribing room queue...");
		return _queue.on(
			"value",
			(snapshot: firebase.database.DataSnapshot) => {
				const queue = snapshot.val() as RoomQueue | null;
				if (!queue) {
					return;
				}
				cb(queue);
			}
		);
	};

	const unsubscribeExtra = (handler: any) => {
		console.debug("[Firebase] Unsubscribing room extra...");
		_extra.off("value", handler);
	};

	const unsubscribeInfo = (handler: any) => {
		console.debug("[Firebase] Unsubscribing room info...");
		_info.off("value", handler);
	};

	const unsubscribeQueue = (handler: any) => {
		console.debug("[Firebase] Unsubscribing room queue...");
		_queue.off("value", handler);
	};

	const init = async ({
		extra,
		info,
		queue
	}: {
		extra: string;
		info: RoomInfo;
		queue: RoomQueue;
	}) => {
		console.debug("[Firebase] Initializing room...", {
			extra: !!extra,
			info,
			queue
		});
		await _room.update({
			extra,
			info,
			queue,
			secret: _secret,
			timestamp: firebase.database.ServerValue.TIMESTAMP
		});
	};

	const updateExtra = async (extra: string) => {
		console.debug("[Firebase] Updating room extra...");
		await _room.update({
			extra,
			secret: _secret,
			timestamp: firebase.database.ServerValue.TIMESTAMP
		});
	};

	const updateInfo = async ({
		name,
		type
	}: Pick<RoomInfo, "name" | "type">) => {
		console.debug("[Firebase] Updating room info...", {
			name,
			type
		});
		await _room.update({
			info: {
				name,
				type
			},
			secret: _secret,
			timestamp: firebase.database.ServerValue.TIMESTAMP
		});
	};

	const updateQueue = async (queue: RoomQueue) => {
		console.debug("[Firebase] Updating room queue...", {
			queue
		});
		await _room.update({
			queue,
			secret: _secret,
			timestamp: firebase.database.ServerValue.TIMESTAMP
		});
	};

	return {
		dbId,
		roomId,
		init,
		isLocked,
		setSecret,
		wait,
		subscribeExtra,
		subscribeInfo,
		subscribeQueue,
		unsubscribeExtra,
		unsubscribeInfo,
		unsubscribeQueue,
		updateExtra,
		updateInfo,
		updateQueue
	};
};
