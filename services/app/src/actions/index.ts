import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../reducers";
import { Player } from "../utils/player";
import { DeezerApi } from "../utils/deezer";

// ------------------------------------------------------------------

export type Action<T extends string> = {
	type: T;
};

export type ActionWithPayload<T extends string, P> = {
	type: T;
	payload: P;
};

export type Extended = {
	deezer: ReturnType<typeof DeezerApi>;
	previewPlayer: ReturnType<typeof Player>;
	queuePlayer: ReturnType<typeof Player>;
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
