import { AsyncAction } from ".";
import { RoomQueue } from "../utils/rooms";
import { displayError } from "./messages";
import { lockRoom } from "./room";
import { ProviderType } from "../utils/medias";
import { extractErrorMessage } from "../utils/messages";

// ------------------------------------------------------------------

export const clearQueue = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { room }
	} = getState();
	if (room && !room.isLocked()) {
		try {
			console.debug("Clearing queue...");
			await room.update({ playing: false, queue: {}, queue_position: 0 });
		} catch (err) {
			dispatch(displayError(extractErrorMessage(err)));
			dispatch(lockRoom());
		}
	} else {
		dispatch(displayError("rooms.error.locked 3"));
	}
};

export const appendInQueue = (
	provider: ProviderType,
	trackIds: string[]
): AsyncAction => async (dispatch, getState) => {
	const {
		room: { medias: queueMedias, room }
	} = getState();
	if (room && !room.isLocked()) {
		if (trackIds.length > 0) {
			try {
				console.debug("Appending queue...", { provider, trackIds });
				const queue: RoomQueue = {};
				[...queueMedias.map(media => media.id), ...trackIds].forEach(
					(id, index) => {
						queue[index] = {
							id,
							provider,
							type: "track"
						};
					}
				);
				await room.update({ queue });
			} catch (err) {
				dispatch(displayError(extractErrorMessage(err)));
				dispatch(lockRoom());
			}
		}
	} else {
		dispatch(displayError("rooms.error.locked 4"));
	}
};

export const removeFromQueue = (index: number): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		room: { medias: queueMedias, position, room }
	} = getState();
	if (room && !room.isLocked()) {
		if (index < queueMedias.length) {
			try {
				if (queueMedias.length > 1) {
					console.debug("Removing track from queue...", { index });
					const oldIndex = position % queueMedias.length;
					const queue: RoomQueue = {};
					const copy = [...queueMedias];
					copy.splice(index, 1);
					copy.forEach((mediaAccess, index) => {
						queue[index] = mediaAccess;
					});
					if (index < oldIndex) {
						await room.update({
							queue,
							queue_position: position - 1
						});
					} else {
						await room.update({
							queue
						});
					}
				} else {
					console.debug("Removing last track from queue...");
					await room.update({
						playing: false,
						queue: {},
						queue_position: 0
					});
				}
			} catch (err) {
				dispatch(displayError(extractErrorMessage(err)));
				dispatch(lockRoom());
			}
		}
	} else {
		dispatch(displayError("rooms.error.locked 5"));
	}
};

export const setQueuePosition = (newPosition: number): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		room: { position: oldPosition, room }
	} = getState();
	if (room && !room.isLocked()) {
		if (oldPosition !== newPosition) {
			try {
				console.debug("Set queue position...", {
					oldPosition,
					newPosition
				});
				await room.update({ queue_position: newPosition });
			} catch (err) {
				dispatch(displayError(extractErrorMessage(err)));
				dispatch(lockRoom());
			}
		}
	} else {
		dispatch(displayError("rooms.error.locked 6"));
	}
};

// ------------------------------------------------------------------

export const moveBackward = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { medias: queueMedias, position }
	} = getState();
	if (queueMedias.length > 0) {
		console.debug("Moving backward...");
		dispatch(
			setQueuePosition(
				position > 0 ? position - 1 : queueMedias.length - 1
			)
		);
	}
};

export const moveForward = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { medias: queueMedias, position }
	} = getState();
	if (queueMedias.length > 0) {
		console.debug("Moving forward...");
		dispatch(setQueuePosition(position + 1));
	}
};
