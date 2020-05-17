import { AsyncAction, trySomething, TrySomethingOptions } from ".";
import { setRoomData } from "../reducers/room";
import {
	generateRandomPosition,
	computePlayerNextPosition
} from "../utils/player";
import { pickColor } from "../utils/colorpicker";
import { displayMediaInfo } from "./medias";
import { extractErrorMessage } from "../utils/messages";
import { displayError } from "./messages";
import { augmentedIndexProcess } from "../utils";
import { PlayMode } from "../utils/rooms";

// ------------------------------------------------------------------

export const startPlayer = (
	{
		position,
		propagate
	}: {
		position?: number;
		propagate: boolean;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom, player, tracks }
				}
			} = getState();
			if (
				player.playing &&
				(position === void 0 || position === player.position)
			) {
				console.debug("[Player] Starting ignored", {
					player,
					position
				});
				return true; // Nothing to do
			}
			console.debug("[Player] Starting...", { position, propagate });
			if (!propagate) {
				dispatch(
					setRoomData({
						player: {
							...player,
							playing: true,
							position:
								position !== void 0
									? position
									: player.mode === "shuffle"
									? generateRandomPosition(tracks.length)
									: player.position
						}
					})
				);
				dispatch(adjustPlayer());
				return true;
			}
			if (!firebaseRoom || firebaseRoom.isLocked()) {
				return "unlock-and-retry";
			}
			await firebaseRoom.updatePlayer({
				...player,
				playing: true,
				position: position !== void 0 ? position : player.position
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
					data: { firebaseRoom, player }
				}
			} = getState();
			if (!player.playing) {
				console.debug("[Player] Stopping ignored");
				return true; // Nothing to do
			}
			console.debug("[Player] Stopping...", { propagate });
			if (!propagate) {
				dispatch(
					setRoomData({
						player: {
							...player,
							playing: false
						}
					})
				);
				dispatch(adjustPlayer());
				return true;
			}
			if (!firebaseRoom || firebaseRoom.isLocked()) {
				return "unlock-and-retry";
			}
			await firebaseRoom.updatePlayer({
				...player,
				playing: false
			});
			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const setPlayerMode = ({
	mode: newMode,
	propagate
}: {
	mode: PlayMode;
	propagate: boolean;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom, player }
				}
			} = getState();
			if (!player || player.mode === newMode) {
				console.debug("[Player] Setting mode ignored");
				return true; // Nothing to do
			}
			console.debug("[Player] Setting mode...", {
				oldMode: player.mode,
				newMode,
				propagate
			});
			if (!propagate) {
				dispatch(
					setRoomData({
						player: {
							...player,
							mode: newMode
						}
					})
				);
				dispatch(adjustPlayer());
				return true;
			}
			if (!firebaseRoom || firebaseRoom.isLocked()) {
				return "unlock-and-retry";
			}
			await firebaseRoom.updatePlayer({
				...player,
				mode: newMode
			});
			return true;
		})
	);

// ------------------------------------------------------------------

export const setPlayerPosition = (
	{
		position: newPosition,
		propagate
	}: {
		position: number;
		propagate: boolean;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom, player }
				}
			} = getState();
			if (!player || player.position === newPosition) {
				console.debug("[Player] Setting position ignored");
				return true; // Nothing to do
			}
			console.debug("[Player] Setting position...", {
				oldPosition: player.position,
				newPosition,
				propagate
			});
			if (!propagate) {
				dispatch(
					setRoomData({
						player: {
							...player,
							playing: true,
							position: newPosition
						}
					})
				);
				dispatch(adjustPlayer());
				return true;
			}
			if (!firebaseRoom || firebaseRoom.isLocked()) {
				return "unlock-and-retry";
			}
			await firebaseRoom.updatePlayer({
				...player,
				position: newPosition
			});
			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const movePlayerToOffset = ({
	propagate,
	offset
}: {
	propagate: boolean;
	offset: number;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { player, tracks }
				}
			} = getState();
			if (offset === 0 || !player || tracks.length === 0) {
				console.debug("[Player] Offset moving ignored");
				return true; // Nothing to do
			}
			const { position: oldPosition } = player;
			let newPosition = 0;
			switch (player.mode) {
				case "shuffle":
					newPosition = generateRandomPosition(tracks.length);
					break;
				case "default":
					newPosition = augmentedIndexProcess(
						tracks.length,
						oldPosition + offset
					);
					break;
			}
			console.debug("[Player] Offset moving...", {
				offset,
				oldPosition,
				newPosition,
				propagate
			});
			dispatch(
				setPlayerPosition({
					position: newPosition,
					propagate
				})
			);
			return true;
		})
	);

// ------------------------------------------------------------------

export const adjustPlayer = (): AsyncAction => async (
	dispatch,
	getState,
	{ player: audioPlayer }
) => {
	const {
		room: {
			data: { player, tracks }
		},
		medias: { data: medias }
	} = getState();

	if (!tracks.length) {
		console.debug("[Player] Stopping because no more tracks...");
		audioPlayer.stop();
		return;
	}

	const { playing, mode, position } = player;

	// Detect and apply change to player
	const nextTrackIndex = computePlayerNextPosition(
		playing,
		audioPlayer.isPlaying(),
		audioPlayer.getPlayingTrackID(),
		audioPlayer.getPlayingTrackPosition() % tracks.length,
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
				audioPlayer.play(
					nextTrackIndex,
					nextTrack.id,
					nextTrack.preview,
					0,
					{
						onEnded: () => dispatch(adjustPlayer()),
						playmode: mode
					}
				)
			]);
			dispatch(displayMediaInfo(nextTrack));
			dispatch(
				setRoomData({
					color,
					player: {
						...player,
						position: nextTrackIndex
					}
				})
			);
		} catch (err) {
			dispatch(displayError(extractErrorMessage(err)));
		}
	} else if (!playing) {
		audioPlayer.stop();
	}
};
