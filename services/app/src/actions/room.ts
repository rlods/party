import { v4 } from "uuid";
//
import { AsyncAction, Dispatch, ActionOptions, trySomething } from ".";
import { displayError } from "./messages";
import { RoomInfo, RoomType, initializeRoom } from "../utils/rooms";
import { FirebaseRoom } from "../utils/firebase";
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
import {
	MediaAccess,
	extractTracks,
	ContextualizedTrackAccess
} from "../utils/medias";

// ------------------------------------------------------------------

export const createRoom = ({
	dbId,
	name,
	secret,
	type,
	options
}: {
	dbId: string;
	name: string;
	secret: string;
	type: RoomType;
	options?: ActionOptions;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					user: {
						access: { userId }
					}
				} = getState();
				if (!userId) {
					dispatch(displayError("user.not_connected"));
					return "connect-and-retry";
				}
				const roomId = v4();
				console.debug("[Room] Creating...", {
					dbId,
					roomId,
					secret
				});

				await FirebaseRoom({ dbId, roomId, secret }).update({
					name,
					type,
					...initializeRoom({ type, userId })
				});
				dispatch(enterRoom({ dbId, roomId, secret, options }));
				return true;
			},
			onFailure: () => {
				if (options?.onFailure) {
					options.onFailure();
				}
			}
		})
	);

// ------------------------------------------------------------------

export const enterRoom = ({
	dbId,
	roomId,
	secret,
	options
}: {
	dbId: string;
	roomId: string;
	secret: string;
	options?: ActionOptions;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { room },
					user: {
						access: { userId }
					}
				} = getState();
				if (room && room.dbId === dbId && room.roomId === roomId) {
					return true; // Nothing to do
				}

				dispatch(exitRoom());

				if (!userId) {
					dispatch(displayError("user.not_connected"));
					return "connect-and-retry";
				}

				dispatch(fetching());

				console.debug("[Room] Entering...", { dbId, roomId, secret });
				const newRoom = FirebaseRoom({ dbId, roomId, secret });
				dispatch(
					setRoom({
						access: { dbId, roomId, secret },
						room: newRoom,
						info: await newRoom.wait()
					})
				);
				dispatch(_watchRoom(newRoom));
				dispatch(_watchPlayer());
				history.push(`/room/${dbId}/${roomId}?secret=${secret}`); // TODO: should push only if we're not already in it
				return true;
			},
			onFailure: () => {
				dispatch(error("Cannot enter")); // TODO: wording
				dispatch(exitRoom());
				if (options?.onFailure) {
					options.onFailure();
				}
			},
			...options
		})
	);

export const exitRoom = (): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { room }
				} = getState();
				if (!room) {
					return true; // Nothing to do
				}
				console.debug("[Room] Exiting...");
				dispatch(_unwatchPlayer());
				dispatch(_unwatchRoom(room));
				dispatch(resetRoom());
				return true;
			}
		})
	);

// ------------------------------------------------------------------

export const lockRoom = (): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: {
						room,
						access: { dbId, roomId, secret: oldSecret }
					}
				} = getState();
				if (
					!room ||
					room.dbId !== dbId ||
					room.roomId !== roomId ||
					!oldSecret
				) {
					return true; // Nothing to do
				}
				console.debug("[Room] Locking...", { dbId, roomId });
				room.setSecret("");
				// TODO : not history.replace(`/room/${dbId}/${roomId}`); as it would trigger a page refresh
				dispatch(setRoom({ access: { dbId, roomId, secret: "" } }));
				return true;
			}
		})
	);

export const unlockRoom = ({
	secret,
	options
}: {
	secret: string;
	options?: ActionOptions;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: {
						room,
						access: { dbId, roomId, secret: oldSecret }
					}
				} = getState();
				if (
					!room ||
					room.dbId !== dbId ||
					room.roomId !== roomId ||
					oldSecret === secret
				) {
					return true; // Nothing to do
				}
				console.debug("[Room] Unlocking...", { dbId, roomId, secret });
				room.setSecret(secret);
				// TODO : not history.replace(`/room/${id}?secret=${secret}`); as it would trigger a page refresh
				dispatch(setRoom({ access: { dbId, roomId, secret } }));
				return true;
			},
			...options
		})
	);

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

let ROOM_WATCHER: any = null;

const _watchRoom = (
	room: ReturnType<typeof FirebaseRoom>
): AsyncAction => async (dispatch, getState, { player }) => {
	console.debug("[Room] Watching...");
	if (!!ROOM_WATCHER) {
		return; // Nothing to do
	}
	ROOM_WATCHER = room.subscribe(
		async (snapshot: firebase.database.DataSnapshot) => {
			// TODO: we could add a queue in case too much updates are received
			const {
				medias: { medias: oldMedias }
			} = getState();
			const newInfo = snapshot.val() as RoomInfo | null;
			console.debug("[Room] Received room update...", { newInfo });
			if (!newInfo) {
				return;
			}

			let medias: MediaAccess[] = [];
			if (newInfo.queue) {
				medias = Object.entries(newInfo.queue)
					.sort(
						(media1, media2) =>
							Number(media1[0]) - Number(media2[0])
					)
					.map(media => media[1]);
			}
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
					info: newInfo,
					medias,
					room,
					tracks
				})
			);
		}
	);
};

const _unwatchRoom = (
	room: ReturnType<typeof FirebaseRoom>
): AsyncAction => async () => {
	if (!ROOM_WATCHER) {
		return; // Nothing to do
	}
	console.debug("Unwatching room...");
	room.unsubscribe(ROOM_WATCHER);
	ROOM_WATCHER = null;
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
			room: { info, tracks },
			medias: { medias }
		} = getState();

		if (info) {
			// Detect and apply change to queue and player
			const nextTrackIndex = computePlayerNextPosition(
				info.playing,
				player.isPlaying(),
				player.getPlayingTrackID(),
				player.getPlayingTrackPosition() % tracks.length,
				tracks,
				info.queue_position
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
								playmode: info.playmode
							}
						)
					]);
					dispatch(displayMediaInfo(nextTrack));
					dispatch(
						setRoom({
							color,
							info: { ...info, queue_position: nextTrackIndex } // for info update because of player change without firebase
						})
					);
				} catch (err) {
					dispatch(displayError(extractErrorMessage(err)));
				}
			} else if (!info.playing) {
				player.stop();
			}
		}

		// Reschedule time
		// console.debug("[Room] Rescheduling");
		_scheduleTimer(dispatch, getState, player, ms);
	}, ms);
};
