import { Reducer } from "redux";
import { AxiosError } from "axios";
import {
	deleteUserAccess,
	saveUserAccess,
	loadUserAccess,
	UserAccess,
	UserInfo
} from "../utils/users";
import { FirebaseUser } from "../utils/firebase";
import { createAction } from "../actions";

// ------------------------------------------------------------------

type UserAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof success>
	| ReturnType<typeof error>
	| ReturnType<typeof resetUser>
	| ReturnType<typeof setUser>;

export const fetching = () => createAction("user/FETCHING");
export const success = () => createAction("user/FETCHED");
export const error = (error: AxiosError) => createAction("user/ERROR", error);
export const resetUser = () => createAction("user/RESET");
export const setUser = (values: Partial<UserData>) =>
	createAction("user/SET", values);

// ------------------------------------------------------------------

export type UserData = {
	user: ReturnType<typeof FirebaseUser> | null;
	access: UserAccess;
	info: UserInfo | null;
};

export type State = UserData & {
	fetching: boolean;
	error: null | AxiosError;
};

const INITIAL_STATE: State = {
	access: { id: "", secret: "" },
	error: null,
	fetching: false,
	info: null,
	user: null
};

// ------------------------------------------------------------------

export const userReducer: Reducer<State, UserAction> = (
	state = { ...INITIAL_STATE, access: loadUserAccess() },
	action: UserAction
): State => {
	switch (action.type) {
		case "user/FETCHING":
			return {
				...state,
				fetching: true,
				error: null
			};
		case "user/FETCHED": {
			return {
				...state,
				fetching: false,
				error: null
			};
		}
		case "user/ERROR":
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		case "user/SET": {
			const copy = {
				...state,
				...action.payload
			};
			saveUserAccess(copy.access);
			return copy;
		}
		case "user/RESET":
			deleteUserAccess();
			return INITIAL_STATE;
		default:
			return state;
	}
};
