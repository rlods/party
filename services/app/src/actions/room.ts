import { AxiosError } from "axios";
import { v4 } from "uuid";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { RoomInfo } from "../utils/rooms";
import { FirebaseRoom } from "../utils/firebase";
import { loadMedias } from "./medias";
import { MediaAccess } from "../utils/medias";
import history from "../utils/history";
import { extractErrorMessage } from "../utils/messages";
import { RoomData } from "../reducers/room";

// ------------------------------------------------------------------

export type RoomAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof success>
	| ReturnType<typeof error>
	| ReturnType<typeof resetRoom>
	| ReturnType<typeof setRoom>;

const fetching = () => createAction("room/FETCHING");
const success = () => createAction("room/FETCHED");
const error = (error: AxiosError) => createAction("room/ERROR", error);
const resetRoom = () => createAction("room/RESET");
export const setRoom = (values: Partial<RoomData>) =>
	createAction("room/SET", values);

// ------------------------------------------------------------------

export const createRoom = (
	name: string,
	secret: string
): AsyncAction => async dispatch => {
	try {
		const id = v4();
		console.debug("Creating room...", { id, secret });
		await FirebaseRoom({ id, secret }).update({ name });
		dispatch(enterRoom(id, secret));
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};

// ------------------------------------------------------------------

let FIREBASE_CB: any = null;

export const enterRoom = (id: string, secret: string): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		room: { room }
	} = getState();
	if (!room || room.id !== id) {
		dispatch(exitRoom());
		try {
			console.debug("Entering room...", { id, secret });
			const newRoom = FirebaseRoom({ id, secret });
			dispatch(
				setRoom({
					access: { id, secret },
					room: newRoom,
					info: await newRoom.wait()
				})
			);
			FIREBASE_CB = newRoom.subscribeInfo(
				(snapshot: firebase.database.DataSnapshot) => {
					const newInfo = snapshot.val() as RoomInfo;
					console.debug(
						"[Firebase] Received room update...",
						newInfo
					);
					let medias: MediaAccess[] = [];
					if (newInfo.queue) {
						medias = Object.entries(newInfo.queue)
							.sort(
								(media1, media2) =>
									Number(media1[0]) - Number(media2[0])
							)
							.map(media => media[1]);
						dispatch(
							loadMedias(
								"deezer",
								"track",
								medias.map(media => media.id),
								false,
								false
							)
						);
					}
					dispatch(
						setRoom({
							medias,
							playing: newInfo.playing,
							position: newInfo.queue_position,
							room: newRoom,
							info: newInfo
						})
					);
				}
			);
			history.push(`/room/${id}?secret=${secret}`); // TODO: should push only if we're not already in it
		} catch (err) {
			dispatch(displayError(extractErrorMessage(err)));
		}
	}
};

export const exitRoom = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { room }
	} = getState();
	if (room) {
		console.debug("Exiting room...");
		room.unsubscribeInfo(FIREBASE_CB);
		FIREBASE_CB = null;
		dispatch(resetRoom());
	}
};

// ------------------------------------------------------------------

export const lockRoom = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: {
			room,
			access: { id }
		}
	} = getState();
	if (room && room.id === id) {
		console.debug("Locking room...", { id });
		room.setSecret("");
		history.replace(`/room/${id}`);
		dispatch(setRoom({ access: { id, secret: "" } }));
	}
};

export const unlockRoom = (secret: string): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		room: {
			room,
			access: { id }
		}
	} = getState();
	if (room && room.id === id) {
		console.debug("Unlocking room...", { id, secret });
		room.setSecret(secret);
		history.replace(`/room/${id}?secret=${secret}`);
		dispatch(setRoom({ access: { id, secret } }));
	}
};
