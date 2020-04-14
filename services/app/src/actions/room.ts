import { AxiosError } from "axios";
import { v4 } from "uuid";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { RoomInfo } from "../utils/rooms";
import { FirebaseRoom } from "../utils/firebase";
import { loadMedias } from "./medias";
import { MediaAccess } from "../utils/medias";
import history from "../utils/history";
import { extractErrorMessage } from "../utils/messages";
import { RoomData } from "../reducers/room";
import { pickColor } from "../utils/colorpicker";
import { Player } from "../utils/player";

// ------------------------------------------------------------------

export type RoomAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof success>
	| ReturnType<typeof error>
	| ReturnType<typeof resetRoom>
	| ReturnType<typeof setRoom>;

const fetching = () => createAction("room/FETCHING");
const success = () => createAction("room/FETCHED");
const error = (error: AxiosError) => createAction("room/ERROR", error);
const resetRoom = () => createAction("room/RESET");
export const setRoom = (values: Partial<RoomData>) =>
	createAction("room/SET", values);

// ------------------------------------------------------------------

export const createRoom = (
	name: string,
	secret: string
): AsyncAction => async dispatch => {
	try {
		const id = v4();
		console.debug("Creating room...", { id, secret });
		await FirebaseRoom({ id, secret }).update({ name });
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
	if (!room || room.id !== id) {
		dispatch(exitRoom());
		try {
			console.debug("Entering room...", { id, secret });
			const newRoom = FirebaseRoom({ id, secret });
			dispatch(
				setRoom({
					access: { id, secret },
					room: newRoom,
					info: await newRoom.wait()
				})
			);
			dispatch(_watchRoom(newRoom));
			history.push(`/room/${id}?secret=${secret}`); // TODO: should push only if we're not already in it
		} catch (err) {
			dispatch(displayError(extractErrorMessage(err)));
		}
	}
};

export const exitRoom = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { room }
	} = getState();
	if (room) {
		console.debug("Exiting room...");
		dispatch(_unwatchPlayer());
		dispatch(_unwatchRoom(room));
		dispatch(resetRoom());
	}
};

// ------------------------------------------------------------------

export const lockRoom = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: {
			room,
			access: { id, secret: oldSecret }
		}
	} = getState();
	if (room && room.id === id && !!oldSecret) {
		console.debug("Locking room...", { id });
		room.setSecret("");
		// TODO : not history.replace(`/room/${id}`); as it would trigger a page refresh
		dispatch(setRoom({ access: { id, secret: "" } }));
	}
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
	if (room && room.id === id && !oldSecret) {
		console.debug("Unlocking room...", { id, secret });
		room.setSecret(secret);
		// TODO : not history.replace(`/room/${id}?secret=${secret}`); as it would trigger a page refresh
		dispatch(setRoom({ access: { id, secret } }));
	}
};

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

let ROOM_WATCHER: any = null;

const _watchRoom = (
	room: ReturnType<typeof FirebaseRoom>
): AsyncAction => async (dispatch, getState) => {
	console.debug("Watching room...");
	if (!ROOM_WATCHER) {
		ROOM_WATCHER = room.subscribe(
			(snapshot: firebase.database.DataSnapshot) => {
				const {
					room: { playing: oldPlaying }
				} = getState();
				const newInfo = snapshot.val() as RoomInfo;
				console.debug("[Firebase] Received room update...", newInfo);
				let medias: MediaAccess[] = [];
				if (newInfo.queue) {
					medias = Object.entries(newInfo.queue)
						.sort(
							(media1, media2) =>
								Number(media1[0]) - Number(media2[0])
						)
						.map(media => media[1]);
					dispatch(
						loadMedias(
							"deezer",
							"track",
							medias.map(media => media.id),
							false,
							false
						)
					);
				}
				if (oldPlaying !== newInfo.playing) {
					if (newInfo.playing) {
						dispatch(_watchPlayer());
					} else {
						dispatch(_unwatchPlayer());
					}
				}
				dispatch(
					setRoom({
						medias,
						playing: newInfo.playing,
						position: newInfo.queue_position,
						room,
						info: newInfo
					})
				);
			}
		);
	}
};

const _unwatchRoom = (
	room: ReturnType<typeof FirebaseRoom>
): AsyncAction => async () => {
	if (ROOM_WATCHER) {
		console.debug("Unwatching room...");
		room.unsubscribe(ROOM_WATCHER);
		ROOM_WATCHER = null;
	}
};

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

let PLAYER_TIMER: NodeJS.Timeout | null = null;

const _computeNextPosition = (
	player: Player,
	queueTrackPosition: number,
	medias: MediaAccess[]
) => {
	let nextPosition = -1;
	const playingTrackID = player.getPlayingTrackID();
	const playingTrackPosition = player.getPlayingTrackPosition();
	if (playingTrackPosition !== queueTrackPosition) {
		if (player.isPlaying()) {
			// User has clicked an other track or added/removed a track in queue
			if (
				playingTrackID !== medias[queueTrackPosition % medias.length].id
			) {
				nextPosition = queueTrackPosition;
			}
		} else {
			// Not playing which means previous track has terminated
			nextPosition =
				playingTrackPosition >= 0
					? playingTrackPosition
					: queueTrackPosition;
		}
	} else if (
		playingTrackID !== medias[queueTrackPosition % medias.length].id
	) {
		// User has deleted playing track
		nextPosition = queueTrackPosition;
	}
	return nextPosition;
};

const _watchPlayer = (): AsyncAction => async (
	dispatch,
	getState,
	{ player }
) => {
	// Don't use setInterval because a step could be triggered before previous one terminated
	PLAYER_TIMER = setTimeout(async () => {
		const {
			room: { medias: queueMedias, position },
			medias: { medias }
		} = getState();
		if (queueMedias.length > 0) {
			// Detect and apply change to queue and player
			const nextTrackPosition = _computeNextPosition(
				player,
				position,
				queueMedias
			);
			if (nextTrackPosition >= 0) {
				const nextIndex = nextTrackPosition % queueMedias.length;
				const nextAccess = queueMedias[nextIndex];
				const nextTrack =
					medias[nextAccess.provider][nextAccess.type][nextAccess.id];
				console.debug("Detected play change...", {
					nextIndex,
					nextTrack,
					nextTrackPosition
				});

				if (nextTrack.type !== "track") {
					console.warn("Found a non track media here, weird...");
				} else {
					try {
						const [color] = await Promise.all([
							pickColor(nextTrack.album.cover_small),
							player.play(
								nextTrackPosition,
								nextTrack.id,
								nextTrack.preview,
								0
							)
						]);
						dispatch(
							setRoom({ color, position: nextTrackPosition })
						);
					} catch (err) {
						dispatch(displayError(extractErrorMessage(err)));
					}
				}
			}

			// Reschedule time
			dispatch(_watchPlayer());
		} else {
			// Last track has been removed from queue by user
			console.debug("No more tracks in queue...");
			dispatch(setRoom({ playing: false }));
			await player.stop();
			PLAYER_TIMER = null;
		}
	}, 250);
};

const _unwatchPlayer = (): AsyncAction => async (
	dispatch,
	getState,
	{ player }
) => {
	if (PLAYER_TIMER) {
		console.debug("Unwatching player...");
		clearTimeout(PLAYER_TIMER);
		PLAYER_TIMER = null;
	}
	await player.stop();
};
