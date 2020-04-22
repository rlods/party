import { v4 } from "uuid";
//
import { AsyncAction, ActionOptions, trySomething } from ".";
import { UserInfo } from "../utils/users";
import { FirebaseUser } from "../utils/firebase";
import { setUser, resetUser } from "../reducers/user";

// ------------------------------------------------------------------

export const createUser = (
	dbId: string,
	name: string,
	secret: string,
	options?: ActionOptions
): AsyncAction => dispatch =>
	dispatch(
		trySomething({
			onAction: async () => {
				console.debug("[User] Creating...");
				const userId = v4();
				await FirebaseUser({ dbId, userId, secret }).update({ name });
				dispatch(connectUser(dbId, userId, secret, options));
				return true;
			}
		})
	);

// ------------------------------------------------------------------

let FIREBASE_CB: any = null;

export const connectUser = (
	dbId: string,
	userId: string,
	secret: string,
	options?: ActionOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					user: { user }
				} = getState();
				if (user && user.dbId === dbId && user.userId === userId) {
					return true; // Nothing to do
				}

				dispatch(disconnectUser());

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
						console.debug(
							"[User] Received user update...",
							newInfo
						);
						dispatch(setUser({ user: newUser, info: newInfo }));
					}
				);
				return true;
			},
			onFailure: () => {
				dispatch(disconnectUser());
				if (options?.onFailure) {
					options.onFailure();
				}
			},
			...options
		})
	);

// ------------------------------------------------------------------

export const disconnectUser = (): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					user: {
						access: { dbId, userId, secret },
						user
					}
				} = getState();
				if (!dbId && !userId && !secret && !user) {
					return true; // Nothing to do
				}
				console.debug("[User] Disconnecting...", {
					dbId,
					userId,
					secret
				});
				if (user) {
					user.unsubscribe(FIREBASE_CB);
					FIREBASE_CB = null;
				}
				dispatch(resetUser());
				return true;
			}
		})
	);

// ------------------------------------------------------------------

export const reconnectUser = (): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					user: {
						access: { dbId, userId, secret }
					}
				} = getState();
				if (!dbId || !userId || !secret) {
					return true; // Nothing to do
				}
				console.debug("[User] Reconnecting...", {
					dbId,
					userId,
					secret
				});
				dispatch(connectUser(dbId, userId, secret));
				return true;
			}
		})
	);
