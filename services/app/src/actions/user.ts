import { v4 } from "uuid";
//
import { AsyncAction, TrySomethingOptions, trySomething } from ".";
import { UserInfo } from "../utils/users";
import { FirebaseUser } from "../utils/firebase/user";
import { setUser, resetUser, fetching, error } from "../reducers/user";

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
					user: { _fbUser }
				} = getState();
				if (
					_fbUser &&
					_fbUser.dbId === dbId &&
					_fbUser.userId === userId
				) {
					return true; // Nothing to do
				}

				dispatch(disconnectUser());

				dispatch(fetching());

				console.debug("[User] Connecting...", { dbId, userId, secret });
				const newFbUser = FirebaseUser({ dbId, userId, secret });
				dispatch(
					setUser({
						_fbUser: newFbUser,
						access: { dbId, userId, secret },
						info: await newFbUser.wait()
					})
				);
				INFO_SUBSCRIPTION = newFbUser.subscribeInfo(
					(newInfo: UserInfo) => {
						console.debug(
							"[User] Received user update...",
							newInfo
						);
						dispatch(setUser({ info: newInfo }));
					}
				);
				return true;
			},
			{
				...options,
				onFailure: () => {
					dispatch(error("Cannot connect")); // TODO: wording
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
					_fbUser,
					access: { dbId, userId, secret }
				}
			} = getState();
			if (!dbId && !userId && !secret && !_fbUser) {
				return true; // Nothing to do
			}
			console.debug("[User] Disconnecting...", {
				dbId,
				userId,
				secret
			});
			if (_fbUser) {
				_fbUser.unsubscribeInfo(INFO_SUBSCRIPTION);
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
