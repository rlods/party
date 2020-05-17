import * as firebase from "firebase/app";
import "firebase/database";
//
import { createOrGetApp, PermissionError } from "./";
import { RoomInfo, RoomQueue, RoomPlayer } from "../rooms";

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
	const _player = _room.child("player");
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
		player: RoomPlayer;
		queue: RoomQueue;
	}> => {
		try {
			console.debug("[Firebase] Waiting room...");
			const [extra, info, player, queue] = await Promise.all([
				_extra.once("value"),
				_info.once("value"),
				_player.once("value"),
				_queue.once("value")
			]);
			const p = player.val() as RoomPlayer;
			const q = queue.val() as RoomQueue | null;
			return {
				extra: extra.val(),
				info: info.val(),
				player: {
					...p,
					position: Math.floor(p.position) // Removing random decimal part
				},
				queue: !q ? {} : q
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
				console.debug("********** NULL INFO: WHY?");
				return;
			}
			cb(info);
		});
	};

	const subscribePlayer = (cb: (player: RoomPlayer) => void) => {
		console.debug("[Firebase] Subscribing room player...");
		return _player.on(
			"value",
			(snapshot: firebase.database.DataSnapshot) => {
				const player = snapshot.val() as RoomPlayer | null;
				if (!player) {
					console.debug("********** NULL PLAYER: WHY?");
					return;
				}
				cb({
					...player,
					position: Math.floor(player.position) // Removing random decimal part
				});
			}
		);
	};

	const subscribeQueue = (cb: (queue: RoomQueue) => void) => {
		console.debug("[Firebase] Subscribing room queue...");
		return _queue.on(
			"value",
			(snapshot: firebase.database.DataSnapshot) => {
				const queue = snapshot.val() as RoomQueue | null;
				cb(!queue ? {} : queue);
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

	const unsubscribePlayer = (handler: any) => {
		console.debug("[Firebase] Unsubscribing room player...");
		_player.off("value", handler);
	};

	const unsubscribeQueue = (handler: any) => {
		console.debug("[Firebase] Unsubscribing room queue...");
		_queue.off("value", handler);
	};

	const init = async ({
		extra,
		info,
		player,
		queue
	}: {
		extra: string;
		info: RoomInfo;
		player: RoomPlayer;
		queue: RoomQueue;
	}) => {
		console.debug("[Firebase] Initializing room...", {
			extraLength: extra.length,
			info,
			player,
			queue
		});
		try {
			await _room.update({
				extra,
				info,
				player,
				queue,
				secret: _secret,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			});
		} catch (err) {
			throw new PermissionError(err.message);
		}
	};

	const updateExtra = async (extra: string) => {
		console.debug("[Firebase] Updating room extra...");
		try {
			await _room.update({
				extra,
				secret: _secret,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			});
		} catch (err) {
			throw new PermissionError(err.message);
		}
	};

	const updateInfo = async ({
		name,
		type
	}: Pick<RoomInfo, "name" | "type">) => {
		console.debug("[Firebase] Updating room info...", {
			name,
			type
		});
		try {
			await _room.update({
				info: {
					name,
					type
				},
				secret: _secret,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			});
		} catch (err) {
			throw new PermissionError(err.message);
		}
	};

	const updatePlayer = async (player: RoomPlayer) => {
		console.debug("[Firebase] Updating room player...", {
			player
		});
		try {
			await _room.update({
				player: {
					...player,
					position: player.position + Math.random() // Adding random decimal part to force position update (eg. to handle case where the play continued beyond position and user want to move backward to specified one)
				},
				secret: _secret,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			});
		} catch (err) {
			throw new PermissionError(err.message);
		}
	};

	const updateQueue = async (queue: RoomQueue) => {
		console.debug("[Firebase] Updating room queue...", {
			queue
		});
		try {
			await _room.update({
				queue,
				secret: _secret,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			});
		} catch (err) {
			throw new PermissionError(err.message);
		}
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
		subscribePlayer,
		subscribeQueue,
		unsubscribeExtra,
		unsubscribeInfo,
		unsubscribePlayer,
		unsubscribeQueue,
		updateExtra,
		updateInfo,
		updatePlayer,
		updateQueue
	};
};
