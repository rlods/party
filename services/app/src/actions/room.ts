import { v4 } from "uuid";
//
import { AsyncAction, Dispatch } from ".";
import { displayError } from "./messages";
import { RoomInfo, RoomType, generateRoomExtra } from "../utils/rooms";
import { FirebaseRoom } from "../utils/firebase";
import { extractErrorMessage } from "../utils/messages";
import { pickColor } from "../utils/colorpicker";
import { Player } from "../utils/player";
import { computePlayerNextPosition } from "../utils/player";
import { loadNewMedias } from "../utils/providers";
import { RootState } from "../reducers";
import { setMedias } from "../reducers/medias";
import { setRoom, resetRoom } from "../reducers/room";
import { displayMediaInfo } from "./medias";
import history from "../utils/history";
import {
	MediaAccess,
	extractTracks,
	ContextualizedTrackAccess
} from "../utils/medias";

// ------------------------------------------------------------------

const DEFAULT_QUEUE_INFO_BY_TYPE: {
	[type: string]: Pick<RoomInfo, "playing" | "playmode" | "queue">;
} = {
	dj: {
		playing: false,
		playmode: "default",
		queue: {}
	},
	seabattle: {
		playing: true,
		playmode: "shuffle",
		queue: {
			0: {
				id: "301013", // Pirates Of The Caribbean OST
				provider: "deezer",
				type: "album"
			},
			1: {
				id: "7358507", // Stalingrad OST
				provider: "deezer",
				type: "album"
			},
			2: {
				id: "558976", // Master & Commander OST
				provider: "deezer",
				type: "album"
			},
			3: {
				id: "87375582", // Le chant du loup OST
				provider: "deezer",
				type: "album"
			}
		}
	}
};

// ------------------------------------------------------------------

export const createRoom = (
	name: string,
	secret: string,
	type: RoomType
): AsyncAction => async (dispatch, getState) => {
	const {
		user: {
			access: { id: userId }
		}
	} = getState();
	if (!userId) {
		dispatch(displayError("users.not_connected"));
		return;
	}
	try {
		const id = v4();
		console.debug("[Room] Creating...", { id, secret });

		await FirebaseRoom({ id, secret }).update({
			extra: generateRoomExtra(userId, type),
			name,
			queue_position: 0,
			type,
			...DEFAULT_QUEUE_INFO_BY_TYPE[type]
		});
		dispatch(enterRoom(id, secret));
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};

// ------------------------------------------------------------------

export const enterRoom = (id: string, secret: string): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		room: { room }
	} = getState();
	if (room && room.id === id) {
		// Nothing to do
		return;
	}
	dispatch(exitRoom());
	try {
		console.debug("[Room] Entering...", { id, secret });
		const newRoom = FirebaseRoom({ id, secret });
		dispatch(
			setRoom({
				access: { id, secret },
				room: newRoom,
				info: await newRoom.wait()
			})
		);
		dispatch(_watchRoom(newRoom));
		dispatch(_watchPlayer());
		history.push(`/room/${id}?secret=${secret}`); // TODO: should push only if we're not already in it
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};

export const exitRoom = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { room }
	} = getState();
	if (!room) {
		// Nothing to do
		return;
	}
	console.debug("[Room] Exiting...");
	dispatch(_unwatchPlayer());
	dispatch(_unwatchRoom(room));
	dispatch(resetRoom());
};

// ------------------------------------------------------------------

export const lockRoom = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: {
			room,
			access: { id, secret: oldSecret }
		}
	} = getState();
	if (!room || room.id !== id || !oldSecret) {
		// Nothing to do
		return;
	}
	console.debug("[Room] Locking...", { id });
	room.setSecret("");
	// TODO : not history.replace(`/room/${id}`); as it would trigger a page refresh
	dispatch(setRoom({ access: { id, secret: "" } }));
};

export const unlockRoom = (secret: string): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		room: {
			room,
			access: { id, secret: oldSecret }
		}
	} = getState();
	if (!room || room.id !== id || oldSecret === secret) {
		// Nothing to do
		return;
	}
	console.debug("[Room] Unlocking...", { id, secret });
	room.setSecret(secret);
	// TODO : not history.replace(`/room/${id}?secret=${secret}`); as it would trigger a page refresh
	dispatch(setRoom({ access: { id, secret } }));
};

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

let ROOM_WATCHER: any = null;

const _watchRoom = (
	room: ReturnType<typeof FirebaseRoom>
): AsyncAction => async (dispatch, getState, { player }) => {
	console.debug("[Room] Watching...");
	if (!!ROOM_WATCHER) {
		// Nothing to do
		return;
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
		// Nothing to do
		return;
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
		console.debug("[Room] Watching player... ********************");
		_scheduleTimer(dispatch, getState, player, 250);
	}
};

const _unwatchPlayer = (): AsyncAction => async (
	dispatch,
	getState,
	{ player }
) => {
	if (PLAYER_TIMER) {
		console.debug("[Room] Unwatching player... ********************");
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
