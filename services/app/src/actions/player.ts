import { AsyncAction, trySomething, TrySomethingOptions } from ".";
import { setRoom } from "../reducers/room";
import {
	generateRandomPosition,
	computePlayerNextPosition
} from "../utils/player";
import { pickColor } from "../utils/colorpicker";
import { displayMediaInfo } from "./medias";
import { extractErrorMessage } from "../utils/messages";
import { displayError } from "./messages";

// ------------------------------------------------------------------

export const startPlayer = (
	{
		propagate
	}: {
		propagate: boolean;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom, queue, tracks }
				}
			} = getState();
			if (!firebaseRoom || firebaseRoom.isLocked() || !queue) {
				return "unlock-and-retry";
			}
			if (queue.playing) {
				return true; // Nothing to do
			}
			console.debug("[Player] Starting...", { propagate });
			if (!propagate) {
				dispatch(
					setRoom({
						queue: {
							...queue,
							playing: true,
							position:
								queue.playmode === "shuffle"
									? generateRandomPosition() % tracks.length
									: queue.position
						}
					})
				);
				return true;
			}
			await firebaseRoom.updateQueue({
				...queue,
				playing: true
			});
			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const stopPlayer = (
	{
		propagate
	}: {
		propagate: boolean;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom, queue }
				}
			} = getState();
			if (!firebaseRoom || firebaseRoom.isLocked() || !queue) {
				return "unlock-and-retry";
			}
			if (!queue.playing) {
				return true; // Nothing to do
			}
			console.debug("[Player] Stopping...", { propagate });
			if (!propagate) {
				dispatch(
					setRoom({
						queue: {
							...queue,
							playing: false
						}
					})
				);
				return true;
			}
			await firebaseRoom.updateQueue({
				...queue,
				playing: false
			});
			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const adjustPlay = (): AsyncAction => async (
	dispatch,
	getState,
	{ player }
) => {
	const {
		room: {
			data: { queue, tracks }
		},
		medias: { data: medias }
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
							onEnded: () => dispatch(adjustPlay()),
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
};
