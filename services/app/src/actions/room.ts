import { v4 } from "uuid";
//
import { history } from "../utils/history";
import { AsyncAction, TrySomethingOptions, trySomething } from ".";
import { FirebaseRoom } from "../utils/firebase/room";
import {
	setRoomAccess,
	setRoomData,
	resetRoom,
	fetchingRoom,
	setRoomError
} from "../reducers/room";
import { decode } from "../utils/encoder";
import { stopPlayer, adjustPlayer } from "./player";
import { adjustQueue } from "./queue";
import {
	RoomInfo,
	RoomType,
	initializeRoom,
	RoomQueue,
	RoomPlayer
} from "../utils/rooms";

// ------------------------------------------------------------------

export const createRoom = (
	{
		dbId,
		name,
		secret,
		type
	}: {
		dbId: string;
		name: string;
		secret: string;
		type: RoomType;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(
			async () => {
				const {
					user: {
						access: { userId }
					}
				} = getState();
				if (!userId) {
					return "connect-and-retry";
				}
				const roomId = v4();

				console.debug("[Room] Creating...", {
					dbId,
					roomId,
					secret
				});
				await FirebaseRoom({ dbId, roomId, secret }).init({
					info: {
						name,
						type
					},
					...initializeRoom({
						type,
						userId
					})
				});
				dispatch(enterRoom({ dbId, roomId, secret }, options));
				return true;
			},
			{
				onFailure: () => {
					if (options?.onFailure) {
						options.onFailure();
					}
				}
			}
		)
	);

// ------------------------------------------------------------------

export type RoomAccess = {
	dbId: string;
	roomId: string;
	secret: string;
};

export const enterRoom = (
	{ dbId, roomId, secret }: RoomAccess,
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(
			async () => {
				const {
					room: {
						data: { firebaseRoom }
					},
					user: {
						access: { userId }
					}
				} = getState();
				if (
					firebaseRoom &&
					firebaseRoom.dbId === dbId &&
					firebaseRoom.roomId === roomId
				) {
					console.debug("[Room] Entering ignored");
					return true; // Nothing to do
				}

				dispatch(exitRoom());

				if (!userId) {
					return "connect-and-retry";
				}

				dispatch(fetchingRoom());

				console.debug("[Room] Entering...", { dbId, roomId, secret });
				const newFbRoom = FirebaseRoom({ dbId, roomId, secret });
				const { extra, info, player, queue } = await newFbRoom.wait();
				dispatch(setRoomAccess({ dbId, roomId, secret }));
				dispatch(
					setRoomData({
						firebaseRoom: newFbRoom,
						extra,
						extraDecoded: extra ? decode(extra) : null,
						info,
						player,
						queue
					})
				);
				dispatch(_watchRoom());
				dispatch(adjustQueue());
				history.push(`/room/${dbId}/${roomId}?secret=${secret}`); // TODO: should push only if we're not already in it
				return true;
			},
			{
				...options,
				onFailure: () => {
					dispatch(setRoomError("Cannot enter")); // TODO: wording
					dispatch(exitRoom());
					if (options?.onFailure) {
						options.onFailure();
					}
				}
			}
		)
	);

// ------------------------------------------------------------------

export const exitRoom = (): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom }
				}
			} = getState();
			if (!firebaseRoom) {
				console.debug("[Room] Exiting ignored");
				return true; // Nothing to do
			}
			console.debug("[Room] Exiting...");
			dispatch(_unwatchRoom());
			dispatch(stopPlayer({ propagate: false }));
			dispatch(resetRoom());
			return true;
		})
	);

// ------------------------------------------------------------------

export const lockRoom = (): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					access: { dbId, roomId, secret: oldSecret },
					data: { firebaseRoom }
				}
			} = getState();
			if (
				!firebaseRoom ||
				firebaseRoom.dbId !== dbId ||
				firebaseRoom.roomId !== roomId ||
				!oldSecret
			) {
				console.debug("[Room] Locking ignored");
				return true; // Nothing to do
			}
			console.debug("[Room] Locking...", { dbId, roomId });
			firebaseRoom.setSecret("");
			// TODO : not history.replace(`/room/${dbId}/${roomId}`); as it would trigger a page refresh
			dispatch(setRoomAccess({ dbId, roomId, secret: "" }));
			return true;
		})
	);

// ------------------------------------------------------------------

export const unlockRoom = (
	{
		secret
	}: {
		secret: string;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					access: { dbId, roomId, secret: oldSecret },
					data: { firebaseRoom }
				}
			} = getState();
			if (
				!firebaseRoom ||
				firebaseRoom.dbId !== dbId ||
				firebaseRoom.roomId !== roomId ||
				oldSecret === secret
			) {
				console.debug("[Room] Unlocking ignored");
				return true; // Nothing to do
			}
			console.debug("[Room] Unlocking...", { dbId, roomId, secret });
			firebaseRoom.setSecret(secret);
			// TODO : not history.replace(`/room/${id}?secret=${secret}`); as it would trigger a page refresh
			dispatch(setRoomAccess({ dbId, roomId, secret }));
			return true;
		}, options)
	);

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

let EXTRA_SUBSCRIPTION: any = null;
let INFO_SUBSCRIPTION: any = null;
let PLAYER_SUBSCRIPTION: any = null;
let QUEUE_SUBSCRIPTION: any = null;

const _watchRoom = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: {
			data: { firebaseRoom }
		}
	} = getState();

	if (!firebaseRoom) {
		console.debug("[Room] Watching ignored");
		return; // Nothing to do
	}

	console.debug("[Room] Watching...");

	if (!EXTRA_SUBSCRIPTION) {
		EXTRA_SUBSCRIPTION = firebaseRoom.subscribeExtra((extra: string) => {
			console.debug("[Room] Received extra update...", {
				extraLength: extra.length
			});
			dispatch(
				setRoomData({
					extra,
					extraDecoded: extra ? decode(extra) : null
				})
			);
		});
	}

	if (!INFO_SUBSCRIPTION) {
		INFO_SUBSCRIPTION = firebaseRoom.subscribeInfo((info: RoomInfo) => {
			console.debug("[Room] Received info update...", { info });
			dispatch(
				setRoomData({
					info
				})
			);
		});
	}

	if (!PLAYER_SUBSCRIPTION) {
		PLAYER_SUBSCRIPTION = firebaseRoom.subscribePlayer(
			(player: RoomPlayer) => {
				console.debug("[Room] Received player update...", { player });
				dispatch(
					setRoomData({
						player
					})
				);
				dispatch(adjustPlayer());
			}
		);
	}

	if (!QUEUE_SUBSCRIPTION) {
		QUEUE_SUBSCRIPTION = firebaseRoom.subscribeQueue((queue: RoomQueue) => {
			console.debug("[Room] Received queue update...", { queue });
			dispatch(
				setRoomData({
					queue
				})
			);
			dispatch(adjustQueue());
		});
	}
};

const _unwatchRoom = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: {
			data: { firebaseRoom }
		}
	} = getState();

	if (!firebaseRoom) {
		console.debug("[Room] Unwatching ignored");
		return; // Nothing to do
	}

	console.debug("[Room] Unwatching...");

	if (!!EXTRA_SUBSCRIPTION) {
		firebaseRoom.unsubscribeExtra(EXTRA_SUBSCRIPTION);
		EXTRA_SUBSCRIPTION = null;
	}
	if (!!INFO_SUBSCRIPTION) {
		firebaseRoom.unsubscribeInfo(INFO_SUBSCRIPTION);
		INFO_SUBSCRIPTION = null;
	}
	if (!!PLAYER_SUBSCRIPTION) {
		firebaseRoom.unsubscribePlayer(PLAYER_SUBSCRIPTION);
		PLAYER_SUBSCRIPTION = null;
	}
	if (!!QUEUE_SUBSCRIPTION) {
		firebaseRoom.unsubscribeQueue(QUEUE_SUBSCRIPTION);
		QUEUE_SUBSCRIPTION = null;
	}
};
