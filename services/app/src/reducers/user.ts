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
	| ReturnType<typeof fetchingUser>
	| ReturnType<typeof resetUser>
	| ReturnType<typeof setUserAccess>
	| ReturnType<typeof setUserData>
	| ReturnType<typeof setUserError>;

export const fetchingUser = () => createAction("user/FETCHING");
export const resetUser = () => createAction("user/RESET");
export const setUserAccess = (access: UserAccess) =>
	createAction("user/SET_ACCESS", access);
export const setUserData = (values: Partial<UserData>) =>
	createAction("user/SET_DATA", values);
export const setUserError = (error: string) =>
	createAction("user/ERROR", error);

// ------------------------------------------------------------------

type UserData = {
	firebaseUser: ReturnType<typeof FirebaseUser> | null;
	info: UserInfo | null;
};

export type State = Readonly<{
	access: UserAccess;
	data: UserData;
	error: null | string;
	fetching: boolean;
}>;

export const INITIAL_STATE: State = {
	access: { dbId: "", userId: "", secret: "" },
	data: {
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
		access: loadUserAccess(),
		data: { firebaseUser: null, info: null }
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
		case "user/SET_ACCESS": {
			saveUserAccess(action.payload);
			return {
				...state,
				access: action.payload,
				fetching: false,
				error: null
			};
		}
		case "user/SET_DATA": {
			return {
				...state,
				data: {
					...state.data,
					...action.payload
				},
				fetching: false,
				error: null
			};
		}
		case "user/RESET":
			deleteUserAccess();
			return INITIAL_STATE;
		default:
			return state;
	}
};
