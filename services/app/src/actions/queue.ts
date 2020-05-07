import { AsyncAction, trySomething, TrySomethingOptions } from ".";
import { MediaAccess, findContextFromTrackIndex } from "../utils/medias";
import { createQueueMerging, createQueueRemoving } from "../utils/rooms";
import { generateRandomPosition } from "../utils/player";
import { setRoom } from "../reducers/room";
import { adjustPlay } from "./player";

// ------------------------------------------------------------------

export const clearQueue = (
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
			console.debug("[Queue] Clearing...");
			if (!propagate) {
				dispatch(
					setRoom({
						queue: {
							...queue,
							playing: false,
							medias: {},
							position: 0
						}
					})
				);
				dispatch(adjustPlay());
				return true;
			}
			await firebaseRoom.updateQueue({
				...queue,
				medias: {},
				playing: false,
				position: 0
			});
			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const appendToQueue = (
	{
		medias: newMedias,
		propagate
	}: {
		medias: ReadonlyArray<MediaAccess>;
		propagate: boolean;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom, queue, medias: oldMedias }
				}
			} = getState();
			if (!firebaseRoom || firebaseRoom.isLocked() || !queue) {
				return "unlock-and-retry";
			}
			if (newMedias.length === 0) {
				return true; // Nothing to do
			}
			console.debug("[Queue] Appending...", {
				newMedias
			});
			if (!propagate) {
				console.debug("TODO: appendToQueue without propagation");
				return true;
			}
			await firebaseRoom.updateQueue({
				...queue,
				medias: createQueueMerging(oldMedias, newMedias)
			});
			return true;
		}, options)
	);

// ------------------------------------------------------------------

// TODO: DECOMPLEXIFY removeFromQueue
export const removeFromQueue = (
	{
		position: removedTrackIndex,
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
				medias: { data: allMedias },
				room: {
					data: { firebaseRoom, queue, medias: oldMedias, tracks }
				}
			} = getState();
			if (!firebaseRoom || firebaseRoom.isLocked() || !queue) {
				return "unlock-and-retry";
			}
			const {
				mediaFirstTrackIndex: removedMediaFirstTrackIndex,
				mediaIndex: removedMediaIndex,
				mediaSize: removedTrackCount
			} = findContextFromTrackIndex(
				oldMedias,
				removedTrackIndex,
				allMedias
			);
			if (removedMediaIndex < 0) {
				return true; // Nothing to do
			}
			const playingTrackIndex = queue.position;
			console.debug("[Queue] Removing...", {
				playingTrackIndex,
				removedMediaIndex,
				removedTrackCount,
				removedTrackIndex,
				removedMediaFirstTrackIndex
			});
			const newMedias = createQueueRemoving(
				oldMedias,
				removedMediaIndex,
				1
			);
			if (!propagate) {
				console.debug("TODO: removeFromQueue without propagation");
				return true;
			}
			if (Object.keys(newMedias).length === 0) {
				console.debug("[Queue] Removing last...");
				await firebaseRoom.updateQueue({
					...queue,
					medias: {},
					playing: false,
					position: 0
				});
			} else if (playingTrackIndex < removedTrackIndex) {
				await firebaseRoom.updateQueue({
					...queue,
					medias: newMedias
				});
			} else if (
				playingTrackIndex >= removedMediaFirstTrackIndex &&
				playingTrackIndex <
					removedMediaFirstTrackIndex + removedTrackCount
			) {
				await firebaseRoom.updateQueue({
					...queue,
					medias: newMedias,
					position:
						removedMediaFirstTrackIndex + removedTrackCount ===
						tracks.length
							? removedMediaFirstTrackIndex - 1
							: removedMediaFirstTrackIndex
				});
			} else {
				await firebaseRoom.updateQueue({
					...queue,
					medias: newMedias,
					position: playingTrackIndex - removedTrackCount
				});
			}
			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const setQueuePosition = (
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
					data: { firebaseRoom, queue }
				}
			} = getState();
			if (!firebaseRoom || firebaseRoom.isLocked() || !queue) {
				return "unlock-and-retry";
			}
			const oldPosition = queue.position;
			if (oldPosition === newPosition) {
				return true; // Nothing to do
			}
			console.debug("[Queue] Setting position...", {
				oldPosition,
				newPosition,
				propagate
			});
			if (!propagate) {
				dispatch(
					setRoom({
						queue: {
							...queue,
							playing: true,
							position: newPosition
						}
					})
				);
				dispatch(adjustPlay());
				return true;
			}
			await firebaseRoom.updateQueue({
				...queue,
				playing: true, // Important: user setting queue position will start the play
				position: newPosition
			});
			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const moveToPreviousTrack = ({
	propagate
}: {
	propagate: boolean;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { queue, tracks }
				}
			} = getState();
			if (!queue || tracks.length === 0) {
				return true; // Nothing to do
			}
			dispatch(
				setQueuePosition({
					position:
						queue.position > 0
							? queue.position - 1
							: tracks.length - 1,
					propagate
				})
			);
			return true;
		})
	);

// ------------------------------------------------------------------

export const moveToNextTrack = ({
	propagate
}: {
	propagate: boolean;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { queue, tracks }
				}
			} = getState();
			if (!queue || tracks.length === 0) {
				return true; // Nothing to do
			}
			dispatch(
				setQueuePosition({
					position:
						queue.playmode === "shuffle"
							? generateRandomPosition() % tracks.length
							: (queue.position + 1) % tracks.length,
					propagate
				})
			);
			return true;
		})
	);
