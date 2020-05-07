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

type UserData = {
	access: UserAccess;
	firebaseUser: ReturnType<typeof FirebaseUser> | null;
	info: UserInfo | null;
};

export type State = Readonly<{
	data: UserData;
	error: null | string;
	fetching: boolean;
}>;

export const INITIAL_STATE: State = {
	data: {
		access: { dbId: "", userId: "", secret: "" },
		firebaseUser: null,
		info: null
	},
	error: null,
	fetching: false
};

// ------------------------------------------------------------------

export const userReducer: Reducer<State, UserAction> = (
	state = {
		...INITIAL_STATE,
		data: { access: loadUserAccess(), firebaseUser: null, info: null }
	},
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
				data: {
					...state.data,
					...action.payload
				},
				fetching: false,
				error: null
			};
			saveUserAccess(copy.data.access);
			return copy;
		}
		case "user/RESET":
			deleteUserAccess();
			return INITIAL_STATE;
		default:
			return state;
	}
};
