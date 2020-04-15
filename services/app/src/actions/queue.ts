import { AsyncAction } from ".";
import { displayError } from "./messages";
import { lockRoom } from "./room";
import { MediaAccess, findContextFromTrackIndex } from "../utils/medias";
import { extractErrorMessage } from "../utils/messages";
import { createQueueMerging, createQueueRemoving } from "../utils/rooms";

// ------------------------------------------------------------------

export const clearQueue = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { info, room }
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.error.locked"));
		return;
	}
	try {
		console.debug("Clearing queue...");
		await room.update({
			...info,
			playing: false,
			queue: {},
			queue_position: 0
		});
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
		dispatch(lockRoom());
	}
};

// ------------------------------------------------------------------

export const appendToQueue = (newMedias: MediaAccess[]): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		room: { info, medias: oldMedias, room }
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.error.locked"));
		return;
	}
	if (newMedias.length === 0) {
		// Nothing to do
		return;
	}
	try {
		console.debug("Appending medias to queue...", {
			newMedias
		});
		await room.update({
			...info,
			queue: createQueueMerging(oldMedias, newMedias)
		});
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
		dispatch(lockRoom());
	}
};

// ------------------------------------------------------------------

// TODO: DECOMPLEXIFY removeFromQueue
export const removeFromQueue = (
	removedTrackIndex: number
): AsyncAction => async (dispatch, getState) => {
	const {
		medias: { medias: allMedias },
		room: { info, medias, room, tracks }
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.error.locked"));
		return;
	}
	const {
		mediaFirstTrackIndex: removedMediaFirstTrackIndex,
		mediaIndex: removedMediaIndex,
		mediaSize: removedTrackCount
	} = findContextFromTrackIndex(medias, removedTrackIndex, allMedias);
	if (removedMediaIndex < 0) {
		// Nothing to do
		return;
	}
	const playingTrackIndex = info.queue_position;
	try {
		console.debug("Removing track from queue...", {
			playingTrackIndex,
			removedMediaIndex,
			removedTrackCount,
			removedTrackIndex,
			removedMediaFirstTrackIndex
		});
		const queue = createQueueRemoving(medias, removedMediaIndex, 1);
		if (Object.keys(queue).length === 0) {
			console.debug("Removing last media from queue...");
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
			playingTrackIndex < removedMediaFirstTrackIndex + removedTrackCount
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
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
		dispatch(lockRoom());
	}
};

// ------------------------------------------------------------------

export const setQueuePosition = (newTrackIndex: number): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		room: { info, room }
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.error.locked"));
		return;
	}
	const oldTrackIndex = info.queue_position;
	if (oldTrackIndex === newTrackIndex) {
		// Nothing to do
		return;
	}
	try {
		console.debug("Set queue position...", {
			oldTrackIndex,
			newTrackIndex
		});
		await room.update({
			...info,
			playing: true, // important
			queue_position: newTrackIndex
		});
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
		dispatch(lockRoom());
	}
};

// ------------------------------------------------------------------

export const moveBackward = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { info, tracks }
	} = getState();
	if (!info || tracks.length === 0) {
		// Nothing to do
		return;
	}
	console.debug("Moving backward...");
	dispatch(
		setQueuePosition(
			info.queue_position > 0
				? info.queue_position - 1
				: tracks.length - 1
		)
	);
};

// ------------------------------------------------------------------

export const moveForward = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { info, tracks }
	} = getState();
	if (!info || tracks.length === 0) {
		// Nothing to do
		return;
	}
	console.debug("Moving forward...");
	dispatch(setQueuePosition((info.queue_position + 1) % tracks.length));
};
