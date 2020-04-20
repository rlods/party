import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
//
import { Player } from "../utils/player";
import { RootState } from "../reducers";

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

export type ActionOptions = { onSuccess?: () => void };
