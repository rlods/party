import { AsyncAction, trySomething } from ".";
import { lockRoom } from "./room";
import { displayError } from "./messages";
import { setRoom } from "../reducers/room";
import { generateRandomPosition } from "../utils/player";

// ------------------------------------------------------------------

export const startPlayer = ({
	propagate
}: {
	propagate: boolean;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { _fbRoom, queue, tracks }
				} = getState();
				if (!_fbRoom || _fbRoom.isLocked() || !queue) {
					dispatch(displayError("rooms.errors.locked"));
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
										? generateRandomPosition() %
										  tracks.length
										: queue.position
							}
						})
					);
					return true;
				}
				await _fbRoom.updateQueue({
					...queue,
					playing: true
				});
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);

// ------------------------------------------------------------------

export const stopPlayer = ({
	propagate
}: {
	propagate: boolean;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { _fbRoom, queue }
				} = getState();
				if (!_fbRoom || _fbRoom.isLocked() || !queue) {
					dispatch(displayError("rooms.errors.locked"));
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
				await _fbRoom.updateQueue({
					...queue,
					playing: false
				});
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);
