import { v4 } from "uuid";
//
import { AsyncAction, Dispatch, TrySomethingOptions, trySomething } from ".";
import { displayError } from "./messages";
import { RoomInfo, RoomType, initializeRoom, RoomQueue } from "../utils/rooms";
import { FirebaseRoom } from "../utils/firebase/room";
import { extractErrorMessage } from "../utils/messages";
import { pickColor } from "../utils/colorpicker";
import { Player } from "../utils/player";
import { computePlayerNextPosition } from "../utils/player";
import { loadNewMedias } from "../utils/providers";
import { RootState } from "../reducers";
import { setMedias } from "../reducers/medias";
import { setRoom, resetRoom, fetching, error } from "../reducers/room";
import { displayMediaInfo } from "./medias";
import history from "../utils/history";
import { decode } from "../utils/encoder";
import {
	MediaAccess,
	extractTracks,
	ContextualizedTrackAccess
} from "../utils/medias";

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
					room: { _fbRoom },
					user: {
						access: { userId }
					}
				} = getState();
				if (
					_fbRoom &&
					_fbRoom.dbId === dbId &&
					_fbRoom.roomId === roomId
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
						_fbRoom: newFbRoom,
						access: { dbId, roomId, secret },
						extra,
						extraDecoded: extra ? decode(extra) : null,
						info
					})
				);
				dispatch(_watchRoom(newFbRoom));
				dispatch(_watchPlayer());
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
				room: { _fbRoom }
			} = getState();
			if (!_fbRoom) {
				return true; // Nothing to do
			}
			console.debug("[Room] Exiting...");
			dispatch(_unwatchPlayer());
			dispatch(_unwatchRoom(_fbRoom));
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
					_fbRoom,
					access: { dbId, roomId, secret: oldSecret }
				}
			} = getState();
			if (
				!_fbRoom ||
				_fbRoom.dbId !== dbId ||
				_fbRoom.roomId !== roomId ||
				!oldSecret
			) {
				return true; // Nothing to do
			}
			console.debug("[Room] Locking...", { dbId, roomId });
			_fbRoom.setSecret("");
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
					_fbRoom,
					access: { dbId, roomId, secret: oldSecret }
				}
			} = getState();
			if (
				!_fbRoom ||
				_fbRoom.dbId !== dbId ||
				_fbRoom.roomId !== roomId ||
				oldSecret === secret
			) {
				return true; // Nothing to do
			}
			console.debug("[Room] Unlocking...", { dbId, roomId, secret });
			_fbRoom.setSecret(secret);
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
	QUEUE_SUBSCRIPTION = fbRoom.subscribeQueue(async (newQueue: RoomQueue) => {
		console.debug("[Room] Received room queue update...", { newQueue });
		const {
			medias: { medias: oldMedias }
		} = getState();
		const medias: MediaAccess[] = !newQueue.medias
			? []
			: Object.entries(newQueue.medias)
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
				queue: newQueue,
				medias,
				tracks
			})
		);
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

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

let PLAYER_TIMER: NodeJS.Timeout | null = null;

const _watchPlayer = (): AsyncAction => async (
	dispatch,
	getState,
	{ player }
) => {
	if (!PLAYER_TIMER) {
		console.debug("[Room] Watching player...");
		_scheduleTimer(dispatch, getState, player, 250);
	}
};

const _unwatchPlayer = (): AsyncAction => async (
	dispatch,
	getState,
	{ player }
) => {
	if (PLAYER_TIMER) {
		console.debug("[Room] Unwatching player...");
		clearTimeout(PLAYER_TIMER);
		PLAYER_TIMER = null;
	}
	await player.stop();
};

// Don't use setInterval because a step could be triggered before previous one terminated
const _scheduleTimer = (
	dispatch: Dispatch,
	getState: () => RootState,
	player: Player,
	ms: number
) => {
	PLAYER_TIMER = setTimeout(async () => {
		const {
			room: { queue, tracks },
			medias: { medias }
		} = getState();
		if (queue) {
			const { playing, playmode, position } = queue;

			// Detect and apply change to queue and player
			const nextTrackIndex = computePlayerNextPosition(
				playing,
				player.isPlaying(),
				player.getPlayingTrackID(),
				player.getPlayingTrackPosition() % tracks.length,
				tracks,
				position
			);

			if (nextTrackIndex >= 0) {
				const nextAccess = tracks[nextTrackIndex];
				const nextTrack =
					medias[nextAccess.provider][nextAccess.type][nextAccess.id];
				console.debug("Detected play change...", {
					nextTrack,
					nextTrackIndex
				});

				try {
					const [color] = await Promise.all([
						pickColor(nextTrack.album.picture_small),
						player.play(
							nextTrackIndex,
							nextTrack.id,
							nextTrack.preview,
							0,
							{
								playmode: playmode
							}
						)
					]);
					dispatch(displayMediaInfo(nextTrack));
					dispatch(
						setRoom({
							color,
							queue: {
								...queue,
								position: nextTrackIndex
							}
						})
					);
				} catch (err) {
					dispatch(displayError(extractErrorMessage(err)));
				}
			} else if (!playing) {
				player.stop();
			}
		}

		// Reschedule time
		// console.debug("[Room] Rescheduling");
		_scheduleTimer(dispatch, getState, player, ms);
	}, ms);
};
