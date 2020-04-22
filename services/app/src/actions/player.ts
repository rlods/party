import { AsyncAction, trySomething } from ".";
import { lockRoom } from "./room";
import { displayError } from "./messages";

// ------------------------------------------------------------------

export const startPlayer = (): AsyncAction => (dispatch, getState) =>
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
				if (info.playing) {
					return true; // Nothing to do
				}
				console.debug("[Player] Starting...");
				await room.update({
					...info,
					playing: true
				});
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);

// ------------------------------------------------------------------

export const stopPlayer = (): AsyncAction => (dispatch, getState) =>
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
				if (!info.playing) {
					return true; // Nothing to do
				}
				console.debug("[Player] Stopping...");
				await room.update({
					...info,
					playing: false
				});
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);
