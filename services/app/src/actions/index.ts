import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
//
import { Player } from "../utils/player";
import { RootState } from "../reducers";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";
import { openModal } from "../reducers/modals";

// ------------------------------------------------------------------

export type Action<T extends string> = {
	type: T;
};

export type ActionWithPayload<T extends string, P> = {
	type: T;
	payload: P;
};

export type Extended = {
	player: Player;
};

export type Dispatch = ThunkDispatch<RootState, Extended, AnyAction>;

export type AsyncAction = ThunkAction<void, RootState, Extended, AnyAction>;

export function createAction<T extends string>(type: T): Action<T>;

export function createAction<T extends string, P>(
	type: T,
	payload: P
): ActionWithPayload<T, P>;

export function createAction<T extends string, P>(type: T, payload?: P) {
	return payload === void 0 ? { type } : { type, payload };
}

export type ActionOptions = { onFailure?: () => void; onSuccess?: () => void };

// ------------------------------------------------------------------

export type TrySomethingStatus =
	| true
	| false
	| "connect-and-retry"
	| "unlock-and-retry";

export type TrySomethingOptions = {
	onAction: () => Promise<TrySomethingStatus>;
	onFailure?: () => void;
	onSuccess?: () => void;
};

export const trySomething = (
	options: TrySomethingOptions
): AsyncAction => async dispatch => {
	let res: TrySomethingStatus = false;
	try {
		res = await options.onAction();
		if (res === "unlock-and-retry") {
			dispatch(
				openModal({
					type: "UnlockRoom",
					props: {
						options: {
							onFailure: () => {
								if (options.onFailure) {
									options.onFailure();
								}
							},
							onSuccess: () => dispatch(trySomething(options))
						}
					}
				})
			);
			return; // Delegated to UnlockRoom
		}
		if (res === "connect-and-retry") {
			dispatch(
				openModal({
					type: "CreateUser",
					props: {
						options: {
							onFailure: () => {
								if (options.onFailure) {
									options.onFailure();
								}
							},
							onSuccess: () => dispatch(trySomething(options))
						}
					}
				})
			);
			return; // Delegated to CreateUser
		}
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
	if (!res) {
		if (options.onFailure) {
			options.onFailure();
			return;
		}
	}
	if (options.onSuccess) {
		options.onSuccess();
	}
};
