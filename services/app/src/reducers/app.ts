import { Reducer } from "redux";
import { createAction } from "../actions";

// ------------------------------------------------------------------

type AppAction = ReturnType<typeof resetApp> | ReturnType<typeof setApp>;

export const resetApp = () => createAction("app/RESET");
export const setApp = (values: Partial<State>) =>
	createAction("app/SET", values);

// ------------------------------------------------------------------

export type State = Readonly<{
	online: boolean;
}>;

export const INITIAL_STATE: State = {
	online: navigator.onLine
};

// ------------------------------------------------------------------

export const appReducer: Reducer<State, AppAction> = (
	state = INITIAL_STATE,
	action: AppAction
): State => {
	switch (action.type) {
		case "app/SET":
			return {
				...state,
				...action.payload
			};
		case "app/RESET":
			return INITIAL_STATE;
		default:
			return state;
	}
};
