import { v4 } from "uuid";
//
import { AsyncAction, Dispatch } from ".";
import { displayError } from "./messages";
import { RoomInfo } from "../utils/rooms";
import { FirebaseRoom } from "../utils/firebase";
import {
	MediaAccess,
	TrackAccess,
	extractTracks,
	ContextualizedTrackAccess
} from "../utils/medias";
import { extractErrorMessage } from "../utils/messages";
import { pickColor } from "../utils/colorpicker";
import { Player } from "../utils/player";
import { loadNew } from "../utils/providers";
import { RootState } from "../reducers";
import { setMedias } from "../reducers/medias";
import { setRoom, resetRoom } from "../reducers/room";
import history from "../utils/history";

// ------------------------------------------------------------------

export const createRoom = (
	name: string,
	secret: string
): AsyncAction => async dispatch => {
	try {
		const id = v4();
		console.debug("[Room] Creating...", { id, secret });
		await FirebaseRoom({ id, secret }).update({
			name,
			playing: false,
			queue: {},
			queue_position: 0
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
			const newInfo = snapshot.val() as RoomInfo;
			console.debug("[Room] Received room update...", newInfo);
			let medias: MediaAccess[] = [];
			if (newInfo.queue) {
				medias = Object.entries(newInfo.queue)
					.sort(
						(media1, media2) =>
							Number(media1[0]) - Number(media2[0])
					)
					.map(media => media[1]);
			}
			if (newInfo.playing !== player.isPlaying()) {
				if (newInfo.playing) {
					if (!!PLAYER_TIMER) {
						console.debug("************ ARG ************");
					}
					dispatch(_watchPlayer());
				} else {
					dispatch(_unwatchPlayer());
				}
			}
			let tracks: ContextualizedTrackAccess[] = [];
			if (medias.length > 0) {
				const { newMedias, newMediasAndTracks } = await loadNew(
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

const _computeNextPosition = (
	player: Player,
	tracks: TrackAccess[],
	trackIndex: number
) => {
	let nextIndex = -1;
	const playingTrackID = player.getPlayingTrackID();
	const playingTrackIndex = player.getPlayingTrackPosition() % tracks.length;
	if (playingTrackIndex !== trackIndex) {
		if (player.isPlaying()) {
			// User has clicked an other track or added/removed a track in queue
			if (playingTrackID !== tracks[trackIndex].id) {
				nextIndex = trackIndex;
			}
		} else {
			// Not playing which means previous track has terminated
			nextIndex = playingTrackIndex >= 0 ? playingTrackIndex : trackIndex;
		}
	} else if (playingTrackID !== tracks[trackIndex].id) {
		// User has deleted playing track
		nextIndex = trackIndex;
	}
	return nextIndex;
};

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
		if (tracks.length > 0) {
			// Detect and apply change to queue and player
			const nextTrackIndex = _computeNextPosition(
				player,
				tracks,
				info!.queue_position
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
						pickColor(nextTrack.album.cover_small),
						player.play(
							nextTrackIndex,
							nextTrack.id,
							nextTrack.preview,
							0
						)
					]);
					dispatch(
						setRoom({
							color,
							info: { ...info!, queue_position: nextTrackIndex } // for info update because of player change without firebase
						})
					);
				} catch (err) {
					dispatch(displayError(extractErrorMessage(err)));
				}
			}

			// Reschedule time
			// console.debug("[Room] Rescheduling");
			_scheduleTimer(dispatch, getState, player, ms);
		} else {
			// Last track has been removed from queue by user
			console.debug("[Room] No more tracks in queue...");
			dispatch(setRoom({ info: { ...info!, playing: false } })); // for info update because of player change  without firebase
			await player.stop();
			PLAYER_TIMER = null;
		}
	}, ms);
};
