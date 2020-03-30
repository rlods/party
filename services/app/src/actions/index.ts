import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../reducers";

// ------------------------------------------------------------------

export type Action<T extends string> = {
  type: T;
};

export type ActionWithPayload<T extends string, P> = {
  type: T;
  payload: P;
};

export type AsyncAction = ThunkAction<void, RootState, void, AnyAction>;

export function createAction<T extends string>(type: T): Action<T>;

export function createAction<T extends string, P>(
  type: T,
  payload: P
): ActionWithPayload<T, P>;

export function createAction<T extends string, P>(type: T, payload?: P) {
  return payload === void 0 ? { type } : { type, payload };
}
