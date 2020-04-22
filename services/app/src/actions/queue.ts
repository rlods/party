import { AsyncAction, trySomething } from ".";
import { displayError } from "./messages";
import { lockRoom } from "./room";
import { MediaAccess, findContextFromTrackIndex } from "../utils/medias";
import { createQueueMerging, createQueueRemoving } from "../utils/rooms";
import { generateRandomPosition } from "../utils/player";
import { setRoom } from "../reducers/room";

// ------------------------------------------------------------------

export const clearQueue = ({
	propagate
}: {
	propagate: boolean;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { info, room }
				} = getState();
				if (!room || room.isLocked() || !info) {
					dispatch(displayError("rooms.errors.locked"));
					return "unlock-and-retry";
				}
				console.debug("[Queue] Clearing...");
				if (!propagate) {
					dispatch(
						setRoom({
							info: {
								...info,
								playing: false,
								queue: {},
								queue_position: 0
							}
						})
					);
					return true;
				}
				await room.update({
					...info,
					playing: false,
					queue: {},
					queue_position: 0
				});
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);

// ------------------------------------------------------------------

export const appendToQueue = (newMedias: MediaAccess[]): AsyncAction => (
	dispatch,
	getState
) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { info, medias: oldMedias, room }
				} = getState();
				if (!room || room.isLocked() || !info) {
					dispatch(displayError("rooms.errors.locked"));
					return "unlock-and-retry";
				}
				if (newMedias.length === 0) {
					return true; // Nothing to do
				}
				console.debug("[Queue] Appending...", {
					newMedias
				});
				await room.update({
					...info,
					queue: createQueueMerging(oldMedias, newMedias)
				});
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);

// ------------------------------------------------------------------

// TODO: DECOMPLEXIFY removeFromQueue
export const removeFromQueue = ({
	position: removedTrackIndex
}: {
	position: number;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					medias: { medias: allMedias },
					room: { info, medias, room, tracks }
				} = getState();
				if (!room || room.isLocked() || !info) {
					dispatch(displayError("rooms.errors.locked"));
					return "unlock-and-retry";
				}
				const {
					mediaFirstTrackIndex: removedMediaFirstTrackIndex,
					mediaIndex: removedMediaIndex,
					mediaSize: removedTrackCount
				} = findContextFromTrackIndex(
					medias,
					removedTrackIndex,
					allMedias
				);
				if (removedMediaIndex < 0) {
					return true; // Nothing to do
				}
				const playingTrackIndex = info.queue_position;
				console.debug("[Queue] Removing...", {
					playingTrackIndex,
					removedMediaIndex,
					removedTrackCount,
					removedTrackIndex,
					removedMediaFirstTrackIndex
				});
				const queue = createQueueRemoving(medias, removedMediaIndex, 1);
				if (Object.keys(queue).length === 0) {
					console.debug("[Queue] Removing last...");
					await room.update({
						...info,
						playing: false,
						queue: {},
						queue_position: 0
					});
				} else if (playingTrackIndex < removedTrackIndex) {
					await room.update({
						...info,
						queue
					});
				} else if (
					playingTrackIndex >= removedMediaFirstTrackIndex &&
					playingTrackIndex <
						removedMediaFirstTrackIndex + removedTrackCount
				) {
					await room.update({
						...info,
						queue,
						queue_position:
							removedMediaFirstTrackIndex + removedTrackCount ===
							tracks.length
								? removedMediaFirstTrackIndex - 1
								: removedMediaFirstTrackIndex
					});
				} else {
					await room.update({
						...info,
						queue,
						queue_position: playingTrackIndex - removedTrackCount
					});
				}
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);

// ------------------------------------------------------------------

export const setQueuePosition = ({
	position: newPosition,
	propagate
}: {
	position: number;
	propagate: boolean;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { info, room }
				} = getState();
				if (!room || room.isLocked() || !info) {
					dispatch(displayError("rooms.errors.locked"));
					return "unlock-and-retry";
				}
				const oldPosition = info.queue_position;
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
							info: {
								...info,
								playing: true,
								queue_position: newPosition
							}
						})
					);
					return true;
				}
				await room.update({
					...info,
					playing: true, // Important: user setting queue position will start the play
					queue_position: newPosition
				});
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);

// ------------------------------------------------------------------

export const moveToPreviousTrack = ({
	propagate
}: {
	propagate: boolean;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { info, tracks }
				} = getState();
				if (!info || tracks.length === 0) {
					return true; // Nothing to do
				}
				dispatch(
					setQueuePosition({
						position:
							info.queue_position > 0
								? info.queue_position - 1
								: tracks.length - 1,
						propagate
					})
				);
				return true;
			}
		})
	);

// ------------------------------------------------------------------

export const moveToNextTrack = ({
	propagate
}: {
	propagate: boolean;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { info, tracks }
				} = getState();
				if (!info || tracks.length === 0) {
					return true; // Nothing to do
				}
				dispatch(
					setQueuePosition({
						position:
							info.playmode === "shuffle"
								? generateRandomPosition() % tracks.length
								: (info.queue_position + 1) % tracks.length,
						propagate
					})
				);
				return true;
			}
		})
	);
