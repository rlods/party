import { AsyncAction, createAction, Dispatch } from ".";
import { setRoom } from "./room";
import { pickColor } from "../utils/colorpicker";
import { setQueuePosition } from "./queue";
import { Player } from "../utils/player";
import { RootState } from "../reducers";
import { MediaAccess } from "../utils/medias";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";

// ------------------------------------------------------------------

export type PlayerAction =
	| ReturnType<typeof resetPlayer>
	| ReturnType<typeof setPlayer>;

const resetPlayer = () => createAction("player/RESET");
const setPlayer = (
	values: Partial<{ playing: boolean; track_percent: number }>
) => createAction("player/SET", values);

// ------------------------------------------------------------------

export const startPlayer = (): AsyncAction => async (
	dispatch,
	getState,
	{ queuePlayer }
) => {
	if (!PLAYER_TIMER) {
		_installTimer(dispatch, getState, queuePlayer);
		dispatch(setPlayer({ playing: true }));
	}
};

// ------------------------------------------------------------------

export const stopPlayer = (): AsyncAction => async (
	dispatch,
	_,
	{ queuePlayer }
) => {
	if (PLAYER_TIMER) {
		clearTimeout(PLAYER_TIMER);
		PLAYER_TIMER = null;
		await queuePlayer.stop();
		dispatch(resetPlayer());
	}
};

// ------------------------------------------------------------------

export const stopPreview = (): AsyncAction => async (
	_1,
	_2,
	{ previewPlayer }
) => {
	console.debug("Stop previewing...");
	await previewPlayer.stop();
};

// ------------------------------------------------------------------

let PLAYER_TIMER: NodeJS.Timeout | null = null;

const _computeNextPosition = (
	queuePlayer: Player,
	queueTrackPosition: number,
	medias: MediaAccess[]
) => {
	let nextPosition = -1;
	const playingTrackID = queuePlayer.getPlayingTrackID();
	const playingTrackPosition = queuePlayer.getPlayingTrackPosition();
	if (playingTrackPosition !== queueTrackPosition) {
		if (queuePlayer.isPlaying()) {
			// User has clicked an other track or added/removed a track in queue
			nextPosition = queueTrackPosition;
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

const _installTimer = (
	dispatch: Dispatch,
	getState: () => RootState,
	queuePlayer: Player
) => {
	// Don't use setInterval because a step could be triggered before previous one terminated
	PLAYER_TIMER = setTimeout(async () => {
		const {
			room: { medias: queueMedias, position },
			medias: {
				medias: { track: tracks }
			}
		} = getState();
		if (queueMedias.length > 0) {
			// Detect and apply change to queue and player
			const nextTrackPosition = _computeNextPosition(
				queuePlayer,
				position,
				queueMedias
			);
			if (nextTrackPosition >= 0) {
				const nextIndex = nextTrackPosition % queueMedias.length;
				const nextTrack = tracks[queueMedias[nextIndex].id];
				console.debug("Detected play change...", {
					nextIndex,
					nextTrack,
					nextTrackPosition
				});

				try {
					dispatch(setQueuePosition(nextTrackPosition));
					const [color] = await Promise.all([
						pickColor(nextTrack.album.cover_small),
						queuePlayer.play(
							nextTrackPosition,
							nextTrack.id,
							nextTrack.preview,
							0
						)
					]);
					dispatch(setRoom({ color }));
				} catch (err) {
					dispatch(displayError(extractErrorMessage(err)));
				}
			}

			// Reschedule time
			_installTimer(dispatch, getState, queuePlayer);
		} else {
			// Last track has been removed from queue by user
			console.debug("No more tracks in queue...");
			dispatch(stopPlayer());
		}
	}, 250);
};
