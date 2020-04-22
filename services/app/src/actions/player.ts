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
					room: { info, room, tracks }
				} = getState();
				if (!room || room.isLocked() || !info) {
					dispatch(displayError("rooms.errors.locked"));
					return "unlock-and-retry";
				}
				if (info.playing) {
					return true; // Nothing to do
				}
				console.debug("[Player] Starting...", { propagate });
				if (!propagate) {
					dispatch(
						setRoom({
							info: {
								...info,
								playing: true,
								queue_position:
									info.playmode === "shuffle"
										? generateRandomPosition() %
										  tracks.length
										: info.queue_position
							}
						})
					);
					return true;
				}
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

export const stopPlayer = ({
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
				if (!info.playing) {
					return true; // Nothing to do
				}
				console.debug("[Player] Stopping...", { propagate });
				if (!propagate) {
					dispatch(
						setRoom({
							info: {
								...info,
								playing: false
							}
						})
					);
					return true;
				}
				await room.update({
					...info,
					playing: false
				});
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);
