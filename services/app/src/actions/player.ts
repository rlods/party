import { AsyncAction } from ".";
import { lockRoom } from "./room";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";

// ------------------------------------------------------------------

export const startPlayer = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { info, room }
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.error.locked"));
		return;
	}
	if (info.playing) {
		// Nothing to do
		return;
	}
	try {
		console.debug("Starting player...");
		await room.update({
			...info,
			playing: true
		});
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
		dispatch(lockRoom());
	}
};

// ------------------------------------------------------------------

export const stopPlayer = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { info, room }
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.error.locked"));
		return;
	}
	if (!info.playing) {
		// Nothing to do
		return;
	}
	try {
		console.debug("Stopping player...");
		await room.update({
			...info,
			playing: false
		});
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
		dispatch(lockRoom());
	}
};
