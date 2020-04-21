import { AsyncAction } from ".";
import { lockRoom } from "./room";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";
import { unlockAndRetry } from "./modals";

// ------------------------------------------------------------------

export const startPlayer = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { info, room }
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.errors.locked"));
		dispatch(unlockAndRetry(() => dispatch(startPlayer())));
		return;
	}
	if (info.playing) {
		// Nothing to do
		return;
	}
	try {
		console.debug("[Player] Starting...");
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
		dispatch(displayError("rooms.errors.locked"));
		dispatch(unlockAndRetry(() => dispatch(stopPlayer())));
		return;
	}
	if (!info.playing) {
		// Nothing to do
		return;
	}
	try {
		console.debug("[Player] Stopping...");
		await room.update({
			...info,
			playing: false
		});
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
		dispatch(lockRoom());
	}
};
