import { Reducer } from "redux";
import { FirebaseUser } from "../utils/firebase/user";
import { createAction } from "../actions";
import {
	deleteUserAccess,
	saveUserAccess,
	loadUserAccess,
	UserAccess,
	UserInfo
} from "../utils/users";

// ------------------------------------------------------------------

type UserAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof error>
	| ReturnType<typeof resetUser>
	| ReturnType<typeof setUser>;

export const fetching = () => createAction("user/FETCHING");
export const error = (error: string) => createAction("user/ERROR", error);
export const resetUser = () => createAction("user/RESET");
export const setUser = (values: Partial<UserData>) =>
	createAction("user/SET", values);

// ------------------------------------------------------------------

export type UserData = {
	_fbUser: ReturnType<typeof FirebaseUser> | null;
	access: UserAccess;
	info: UserInfo | null;
};

export type State = UserData & {
	fetching: boolean;
	error: null | string;
};

const INITIAL_STATE: State = {
	_fbUser: null,
	access: { dbId: "", userId: "", secret: "" },
	error: null,
	fetching: false,
	info: null
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
		case "user/ERROR":
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		case "user/SET": {
			const copy = {
				...state,
				...action.payload,
				fetching: false,
				error: null
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
