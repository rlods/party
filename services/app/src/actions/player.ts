import { AsyncAction, trySomething, TrySomethingOptions } from ".";
import { setRoom } from "../reducers/room";
import { generateRandomPosition } from "../utils/player";

// ------------------------------------------------------------------

export const startPlayer = (
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
				room: { _fbRoom, queue, tracks }
			} = getState();
			if (!_fbRoom || _fbRoom.isLocked() || !queue) {
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
									? generateRandomPosition() % tracks.length
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
		}, options)
	);

// ------------------------------------------------------------------

export const stopPlayer = (
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
				room: { _fbRoom, queue }
			} = getState();
			if (!_fbRoom || _fbRoom.isLocked() || !queue) {
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
		}, options)
	);
