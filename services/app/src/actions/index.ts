import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
//
import { Player } from "../utils/player";
import { RootState } from "../reducers";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";
import { openModal } from "../reducers/modals";
import { PermissionError } from "../utils/firebase";
import { renderUserCreateModal } from "../modals/CreateUserModal";
import { renderUnlockRoomModal } from "../modals/UnlockRoomModal";

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

// ------------------------------------------------------------------

export type TrySomethingOptions = {
	onFailure?: () => void;
	onSuccess?: () => void;
};

export type TrySomethingStatus =
	| true
	| false
	| "connect-and-retry"
	| "unlock-and-retry";

export const trySomething = (
	onAction: () => Promise<TrySomethingStatus>,
	options?: TrySomethingOptions
): AsyncAction => async dispatch => {
	let res: TrySomethingStatus = false;
	try {
		res = await onAction();
		if (res === "unlock-and-retry") {
			dispatch(displayError("rooms.errors.locked"));
			dispatch(
				openModal(() =>
					renderUnlockRoomModal({
						options: {
							onFailure: options?.onFailure,
							onSuccess: () =>
								dispatch(trySomething(onAction, options))
						}
					})
				)
			);
			return; // Delegated to UnlockRoomModal
		}
		if (res === "connect-and-retry") {
			dispatch(displayError("user.not_connected"));
			dispatch(
				openModal(() =>
					renderUserCreateModal({
						options: {
							onFailure: options?.onFailure,
							onSuccess: () =>
								dispatch(trySomething(onAction, options))
						}
					})
				)
			);
			return; // Delegated to CreateUserModal
		}
	} catch (err) {
		if (err instanceof PermissionError) {
			console.error("Detected a firebase permission error"); // TODO: lock
		}
		dispatch(displayError(extractErrorMessage(err)));
	}
	if (!res) {
		if (options?.onFailure) {
			options.onFailure();
			return;
		}
	}
	if (options?.onSuccess) {
		options.onSuccess();
	}
};
