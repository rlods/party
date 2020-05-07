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
				room: {
					data: { firebaseRoom, queue, tracks }
				}
			} = getState();
			if (!firebaseRoom || firebaseRoom.isLocked() || !queue) {
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
			await firebaseRoom.updateQueue({
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
				room: {
					data: { firebaseRoom, queue }
				}
			} = getState();
			if (!firebaseRoom || firebaseRoom.isLocked() || !queue) {
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
			await firebaseRoom.updateQueue({
				...queue,
				playing: false
			});
			return true;
		}, options)
	);
