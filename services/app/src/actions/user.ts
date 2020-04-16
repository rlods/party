import { v4 } from "uuid";
//
import { AsyncAction } from ".";
import { UserInfo } from "../utils/users";
import { FirebaseUser } from "../utils/firebase";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";
import { setUser, resetUser } from "../reducers/user";

// ------------------------------------------------------------------

export const createUser = (
	name: string,
	secret: string
): AsyncAction => async dispatch => {
	try {
		console.debug("[User] Creating...");
		const id = v4();
		await FirebaseUser({ id, secret }).update({ name });
		dispatch(connectUser(id, secret));
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};

// ------------------------------------------------------------------

let FIREBASE_CB: any = null;

export const connectUser = (id: string, secret: string): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		user: { user }
	} = getState();
	if (user && user.id === id) {
		// Nothing to do
		return;
	}
	dispatch(disconnectUser());
	try {
		console.debug("[User] Connecting...", { id, secret });
		const newUser = FirebaseUser({ id, secret });
		dispatch(
			setUser({
				access: { id, secret },
				user: newUser,
				info: await newUser.wait()
			})
		);
		FIREBASE_CB = newUser.subscribe(
			(snapshot: firebase.database.DataSnapshot) => {
				const newInfo = snapshot.val() as UserInfo;
				console.debug("[User] Received user update...", newInfo);
				dispatch(setUser({ user: newUser, info: newInfo }));
			}
		);
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
		dispatch(setUser({ access: { id, secret: "" } }));
	}
};

export const disconnectUser = (): AsyncAction => async (dispatch, getState) => {
	const {
		user: {
			access: { id, secret },
			user
		}
	} = getState();
	if (!id && !secret && !user) {
		// Nothing to do
		return;
	}
	console.debug("[User] Disconnecting...");
	if (user) {
		user.unsubscribe(FIREBASE_CB);
		FIREBASE_CB = null;
	}
	dispatch(resetUser());
};

export const reconnectUser = (): AsyncAction => async (dispatch, getState) => {
	const {
		user: {
			access: { id, secret }
		}
	} = getState();
	if (!id || !secret) {
		// Nothing to do
		return;
	}
	console.debug("[User] Reconnecting...", { id, secret });
	dispatch(connectUser(id, secret));
};
