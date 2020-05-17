import { AsyncAction, trySomething, TrySomethingOptions } from ".";
import {
	MediaAccess,
	findContextFromTrackIndex,
	ContextualizedTrackAccess,
	extractTracks
} from "../utils/medias";
import { createQueueMerging, createQueueRemoving } from "../utils/rooms";
import { setRoomData } from "../reducers/room";
import { adjustPlayer } from "./player";
import { loadNewMedias } from "../utils/providers";
import { setMedias } from "../reducers/medias";

// ------------------------------------------------------------------

export const clearQueue = (
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
					data: { firebaseRoom, player }
				}
			} = getState();
			console.debug("[Queue] Clearing...");
			if (!propagate) {
				dispatch(
					setRoomData({
						player: {
							...player,
							position: 0
						},
						queue: {}
					})
				);
				dispatch(adjustQueue("x1"));
				return true;
			}
			if (!firebaseRoom || firebaseRoom.isLocked()) {
				return "unlock-and-retry";
			}
			await firebaseRoom.updateQueue({});
			await firebaseRoom.updatePlayer({
				...player,
				position: 0
			});
			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const appendToQueue = (
	{
		medias: newMedias,
		propagate
	}: {
		medias: ReadonlyArray<MediaAccess>;
		propagate: boolean;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom, medias: oldMedias }
				}
			} = getState();
			if (newMedias.length === 0) {
				console.debug("[Queue] Appending ignored");
				return true; // Nothing to do
			}
			console.debug("[Queue] Appending...", {
				newMedias,
				propagate
			});
			if (!propagate) {
				dispatch(
					setRoomData({
						queue: createQueueMerging(oldMedias, newMedias)
					})
				);
				dispatch(adjustQueue("x2"));
				return true;
			}
			if (!firebaseRoom || firebaseRoom.isLocked()) {
				return "unlock-and-retry";
			}
			await firebaseRoom.updateQueue(
				createQueueMerging(oldMedias, newMedias)
			);
			return true;
		}, options)
	);

// ------------------------------------------------------------------

// TODO: DECOMPLEXIFY removeFromQueue
export const removeFromQueue = (
	{
		position: removedTrackIndex,
		propagate
	}: {
		position: number;
		propagate: boolean;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				medias: { data: allMedias },
				room: {
					data: { firebaseRoom, player, medias: oldMedias, tracks }
				}
			} = getState();
			if (!firebaseRoom || firebaseRoom.isLocked()) {
				return "unlock-and-retry";
			}
			const {
				mediaFirstTrackIndex: removedMediaFirstTrackIndex,
				mediaIndex: removedMediaIndex,
				mediaSize: removedTrackCount
			} = findContextFromTrackIndex(
				oldMedias,
				removedTrackIndex,
				allMedias
			);
			if (removedMediaIndex < 0) {
				console.debug("[Queue] Removing ignored");
				return true; // Nothing to do
			}
			const playingTrackIndex = player.position;
			console.debug("[Queue] Removing...", {
				playingTrackIndex,
				removedMediaIndex,
				removedTrackCount,
				removedTrackIndex,
				removedMediaFirstTrackIndex
			});
			const newMedias = createQueueRemoving(
				oldMedias,
				removedMediaIndex,
				1
			);
			if (!propagate) {
				console.debug("TODO: removeFromQueue without propagation");
				return true;
			}
			if (Object.keys(newMedias).length === 0) {
				console.debug("[Queue] Removing last...");
				await firebaseRoom.updateQueue({});
				await firebaseRoom.updatePlayer({
					...player,
					position: 0
				});
			} else if (playingTrackIndex < removedTrackIndex) {
				await firebaseRoom.updateQueue(newMedias);
			} else if (
				playingTrackIndex >= removedMediaFirstTrackIndex &&
				playingTrackIndex <
					removedMediaFirstTrackIndex + removedTrackCount
			) {
				await firebaseRoom.updateQueue(newMedias);
				await firebaseRoom.updatePlayer({
					...player,
					position:
						removedMediaFirstTrackIndex + removedTrackCount ===
						tracks.length
							? removedMediaFirstTrackIndex - 1
							: removedMediaFirstTrackIndex
				});
			} else {
				await firebaseRoom.updateQueue(newMedias);
				await firebaseRoom.updatePlayer({
					...player,
					position: playingTrackIndex - removedTrackCount
				});
			}
			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const adjustQueue = (context: string): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		medias: { data: oldMedias },
		room: {
			data: { queue }
		}
	} = getState();

	console.debug("[Queue] Adjusting...", { context });

	const medias: ReadonlyArray<MediaAccess> = Object.entries(queue)
		.sort((m1, m2) => Number(m1[0]) - Number(m2[0]))
		.map(m => m[1]);
	let tracks: ContextualizedTrackAccess[] = [];
	if (medias.length > 0) {
		const { newMedias, newMediasAndTracks } = await loadNewMedias(
			medias,
			oldMedias
		);
		if (newMediasAndTracks.length > 0) {
			dispatch(setMedias(newMediasAndTracks));
		}
		tracks = extractTracks(medias, oldMedias, newMedias);
	}
	dispatch(
		setRoomData({
			medias,
			tracks
		})
	);
	dispatch(adjustPlayer("x6"));
};
