import { v4 } from "uuid";
//
import { AsyncAction, TrySomethingOptions, trySomething } from ".";
import { RoomInfo, RoomType, initializeRoom, RoomQueue } from "../utils/rooms";
import { FirebaseRoom } from "../utils/firebase/room";
import { loadNewMedias } from "../utils/providers";
import { setMedias } from "../reducers/medias";
import { setRoom, resetRoom, fetching, error } from "../reducers/room";
import history from "../utils/history";
import { decode } from "../utils/encoder";
import {
	MediaAccess,
	extractTracks,
	ContextualizedTrackAccess
} from "../utils/medias";
import { adjustPlayer } from "./player";

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
						data: {
							access: { userId }
						}
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

				const { extra, queue } = initializeRoom({ type, userId });
				await FirebaseRoom({ dbId, roomId, secret }).init({
					extra,
					info: {
						name,
						type
					},
					queue
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
						data: {
							access: { userId }
						}
					}
				} = getState();
				if (
					firebaseRoom &&
					firebaseRoom.dbId === dbId &&
					firebaseRoom.roomId === roomId
				) {
					return true; // Nothing to do
				}

				dispatch(exitRoom());

				if (!userId) {
					return "connect-and-retry";
				}

				dispatch(fetching());

				console.debug("[Room] Entering...", { dbId, roomId, secret });
				const newFbRoom = FirebaseRoom({ dbId, roomId, secret });
				const { extra, info } = await newFbRoom.wait();
				dispatch(
					setRoom({
						firebaseRoom: newFbRoom,
						access: { dbId, roomId, secret },
						extra,
						extraDecoded: extra ? decode(extra) : null,
						info
					})
				);
				dispatch(_watchRoom(newFbRoom));
				history.push(`/room/${dbId}/${roomId}?secret=${secret}`); // TODO: should push only if we're not already in it
				return true;
			},
			{
				...options,
				onFailure: () => {
					dispatch(error("Cannot enter")); // TODO: wording
					dispatch(exitRoom());
					if (options?.onFailure) {
						options.onFailure();
					}
				}
			}
		)
	);

export const exitRoom = (): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom }
				}
			} = getState();
			if (!firebaseRoom) {
				return true; // Nothing to do
			}
			console.debug("[Room] Exiting...");
			dispatch(_unwatchRoom(firebaseRoom));
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
					data: {
						firebaseRoom,
						access: { dbId, roomId, secret: oldSecret }
					}
				}
			} = getState();
			if (
				!firebaseRoom ||
				firebaseRoom.dbId !== dbId ||
				firebaseRoom.roomId !== roomId ||
				!oldSecret
			) {
				return true; // Nothing to do
			}
			console.debug("[Room] Locking...", { dbId, roomId });
			firebaseRoom.setSecret("");
			// TODO : not history.replace(`/room/${dbId}/${roomId}`); as it would trigger a page refresh
			dispatch(setRoom({ access: { dbId, roomId, secret: "" } }));
			return true;
		})
	);

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
					data: {
						firebaseRoom,
						access: { dbId, roomId, secret: oldSecret }
					}
				}
			} = getState();
			if (
				!firebaseRoom ||
				firebaseRoom.dbId !== dbId ||
				firebaseRoom.roomId !== roomId ||
				oldSecret === secret
			) {
				return true; // Nothing to do
			}
			console.debug("[Room] Unlocking...", { dbId, roomId, secret });
			firebaseRoom.setSecret(secret);
			// TODO : not history.replace(`/room/${id}?secret=${secret}`); as it would trigger a page refresh
			dispatch(setRoom({ access: { dbId, roomId, secret } }));
			return true;
		}, options)
	);

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

let EXTRA_SUBSCRIPTION: any = null;
let INFO_SUBSCRIPTION: any = null;
let QUEUE_SUBSCRIPTION: any = null;

const _watchRoom = (
	fbRoom: ReturnType<typeof FirebaseRoom>
): AsyncAction => async (dispatch, getState) => {
	console.debug("[Room] Watching...");
	if (!!EXTRA_SUBSCRIPTION || !!INFO_SUBSCRIPTION || !!QUEUE_SUBSCRIPTION) {
		return; // Nothing to do
	}
	EXTRA_SUBSCRIPTION = fbRoom.subscribeExtra(async (newExtra: string) => {
		console.debug("[Room] Received room extra update...", { newExtra });
		dispatch(
			setRoom({
				extra: newExtra,
				extraDecoded: newExtra ? decode(newExtra) : null
			})
		);
	});
	INFO_SUBSCRIPTION = fbRoom.subscribeInfo(async (newInfo: RoomInfo) => {
		console.debug("[Room] Received room info update...", { newInfo });
		dispatch(
			setRoom({
				info: newInfo
			})
		);
	});
	QUEUE_SUBSCRIPTION = fbRoom.subscribeQueue(async (queue: RoomQueue) => {
		console.debug("[Room] Received room queue update...", { queue });
		const {
			medias: { data: oldMedias }
		} = getState();
		const medias: ReadonlyArray<MediaAccess> = !queue.medias
			? []
			: Object.entries(queue.medias)
					.sort((m1, m2) => Number(m1[0]) - Number(m2[0]))
					.map(m => m[1]);
		let tracks: ContextualizedTrackAccess[] = [];
		if (medias.length > 0) {
			const { newMedias, newMediasAndTracks } = await loadNewMedias(
				medias,
				oldMedias
			);
			if (newMediasAndTracks.length > 0) {
				dispatch(setMedias(newMediasAndTracks));
			}
			tracks = extractTracks(medias, oldMedias, newMedias);
		}
		dispatch(
			setRoom({
				medias,
				queue,
				tracks
			})
		);
		dispatch(adjustPlayer());
	});
};

const _unwatchRoom = (
	room: ReturnType<typeof FirebaseRoom>
): AsyncAction => async () => {
	if (!!EXTRA_SUBSCRIPTION) {
		console.debug("Unwatching room extra...");
		room.unsubscribeExtra(EXTRA_SUBSCRIPTION);
		EXTRA_SUBSCRIPTION = null;
	}
	if (!!INFO_SUBSCRIPTION) {
		console.debug("Unwatching room info...");
		room.unsubscribeInfo(INFO_SUBSCRIPTION);
		INFO_SUBSCRIPTION = null;
	}
	if (!!QUEUE_SUBSCRIPTION) {
		console.debug("Unwatching room queue...");
		room.unsubscribeQueue(QUEUE_SUBSCRIPTION);
		QUEUE_SUBSCRIPTION = null;
	}
};
