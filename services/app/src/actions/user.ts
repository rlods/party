import { v4 } from "uuid";
//
import { AsyncAction, TrySomethingOptions, trySomething } from ".";
import { UserInfo } from "../utils/users";
import { FirebaseUser } from "../utils/firebase/user";
import {
	setUserAccess,
	setUserData,
	resetUser,
	fetchingUser,
	setUserError
} from "../reducers/user";

// ------------------------------------------------------------------

export const createUser = (
	{
		dbId,
		name,
		secret
	}: {
		dbId: string;
		name: string;
		secret: string;
	},
	options?: TrySomethingOptions
): AsyncAction => dispatch =>
	dispatch(
		trySomething(
			async () => {
				console.debug("[User] Creating...");
				const userId = v4();
				await FirebaseUser({ dbId, userId, secret }).update({ name });
				dispatch(connectUser({ dbId, userId, secret }, options));
				return true;
			},
			{
				onFailure: () => {
					if (options?.onFailure) {
						options.onFailure();
					}
				}
			}
		)
	);

// ------------------------------------------------------------------

let INFO_SUBSCRIPTION: any = null;

export const connectUser = (
	{
		dbId,
		userId,
		secret
	}: {
		dbId: string;
		userId: string;
		secret: string;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(
			async () => {
				const {
					user: {
						data: { firebaseUser }
					}
				} = getState();
				if (
					firebaseUser &&
					firebaseUser.dbId === dbId &&
					firebaseUser.userId === userId
				) {
					console.debug("[User] Connecting ignored");
					return true; // Nothing to do
				}

				dispatch(disconnectUser());

				dispatch(fetchingUser());

				console.debug("[User] Connecting...", { dbId, userId, secret });
				const newFbUser = FirebaseUser({ dbId, userId, secret });
				dispatch(setUserAccess({ dbId, userId, secret }));
				dispatch(
					setUserData({
						firebaseUser: newFbUser,
						info: await newFbUser.wait()
					})
				);
				INFO_SUBSCRIPTION = newFbUser.subscribeInfo(
					(newInfo: UserInfo) => {
						console.debug(
							"[User] Received user update...",
							newInfo
						);
						dispatch(setUserData({ info: newInfo }));
					}
				);
				return true;
			},
			{
				...options,
				onFailure: () => {
					dispatch(setUserError("Cannot connect")); // TODO: wording
					dispatch(disconnectUser());
					if (options?.onFailure) {
						options.onFailure();
					}
				}
			}
		)
	);

// ------------------------------------------------------------------

export const disconnectUser = (): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				user: {
					access: { dbId, userId, secret },
					data: { firebaseUser }
				}
			} = getState();
			if (!dbId && !userId && !secret && !firebaseUser) {
				console.debug("[User] Disconnecting ignored");
				return true; // Nothing to do
			}
			console.debug("[User] Disconnecting...", {
				dbId,
				userId,
				secret
			});
			if (firebaseUser) {
				firebaseUser.unsubscribeInfo(INFO_SUBSCRIPTION);
				INFO_SUBSCRIPTION = null;
			}
			dispatch(resetUser());
			return true;
		})
	);

// ------------------------------------------------------------------

export const reconnectUser = (): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				user: {
					access: { dbId, userId, secret }
				}
			} = getState();
			if (!dbId || !userId || !secret) {
				console.debug("[User] Reconnecting ignored");
				return true; // Nothing to do
			}
			console.debug("[User] Reconnecting...", {
				dbId,
				userId,
				secret
			});
			dispatch(connectUser({ dbId, userId, secret }));
			return true;
		})
	);
