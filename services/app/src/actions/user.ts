import { v4 } from "uuid";
//
import { AsyncAction, ActionOptions } from ".";
import { UserInfo } from "../utils/users";
import { FirebaseUser } from "../utils/firebase";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";
import { setUser, resetUser } from "../reducers/user";

// ------------------------------------------------------------------

export const createUser = (
	dbId: string,
	name: string,
	secret: string,
	options?: ActionOptions
): AsyncAction => async dispatch => {
	try {
		console.debug("[User] Creating...");
		const userId = v4();
		await FirebaseUser({ dbId, userId, secret }).update({ name });
		dispatch(connectUser(dbId, userId, secret, options));
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};

// ------------------------------------------------------------------

let FIREBASE_CB: any = null;

export const connectUser = (
	dbId: string,
	userId: string,
	secret: string,
	options?: ActionOptions
): AsyncAction => async (dispatch, getState) => {
	const {
		user: { user }
	} = getState();
	if (user && user.dbId === dbId && user.userId === userId) {
		// Nothing to do
		return;
	}
	dispatch(disconnectUser());
	try {
		console.debug("[User] Connecting...", { dbId, userId, secret });
		const newUser = FirebaseUser({ dbId, userId, secret });
		dispatch(
			setUser({
				access: { dbId, userId, secret },
				user: newUser,
				info: await newUser.wait()
			})
		);
		FIREBASE_CB = newUser.subscribe(
			(snapshot: firebase.database.DataSnapshot) => {
				const newInfo = snapshot.val() as UserInfo | null;
				console.debug("[User] Received user update...", newInfo);
				dispatch(setUser({ user: newUser, info: newInfo }));
			}
		);
		if (options && options.onSuccess) {
			options.onSuccess();
		}
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
		dispatch(disconnectUser());
	}
};

export const disconnectUser = (): AsyncAction => async (dispatch, getState) => {
	const {
		user: {
			access: { dbId, userId, secret },
			user
		}
	} = getState();
	if (!dbId && !userId && !secret && !user) {
		// Nothing to do
		return;
	}
	console.debug("[User] Disconnecting...", { dbId, userId, secret });
	if (user) {
		user.unsubscribe(FIREBASE_CB);
		FIREBASE_CB = null;
	}
	dispatch(resetUser());
};

export const reconnectUser = (): AsyncAction => async (dispatch, getState) => {
	const {
		user: {
			access: { dbId, userId, secret }
		}
	} = getState();
	if (!dbId || !userId || !secret) {
		// Nothing to do
		return;
	}
	console.debug("[User] Reconnecting...", { dbId, userId, secret });
	dispatch(connectUser(dbId, userId, secret));
};
