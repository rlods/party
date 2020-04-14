import { AsyncAction } from ".";
import { lockRoom } from "./room";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";

// ------------------------------------------------------------------

export const startPlayer = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { room, playing }
	} = getState();
	if (room && !room.isLocked()) {
		if (!playing) {
			try {
				console.debug("Starting player...");
				await room.update({
					playing: true
				});
			} catch (err) {
				dispatch(displayError(extractErrorMessage(err)));
				dispatch(lockRoom());
			}
		}
	} else {
		dispatch(displayError("rooms.error.locked"));
	}
};

// ------------------------------------------------------------------

export const stopPlayer = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { playing, room }
	} = getState();
	if (room && !room.isLocked()) {
		if (playing) {
			try {
				console.debug("Stopping player...");
				await room.update({
					playing: false
				});
			} catch (err) {
				dispatch(displayError(extractErrorMessage(err)));
				dispatch(lockRoom());
			}
		}
	} else {
		dispatch(displayError("rooms.error.locked"));
	}
};
