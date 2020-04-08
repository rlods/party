import { Reducer } from "redux";
import { AxiosError } from "axios";
import { UserAction } from "../actions/user";
import {
	deleteUserAccess,
	saveUserAccess,
	loadUserAccess,
	UserAccess,
	UserInfo
} from "../utils/users";
import { FirebaseUser } from "../utils/firebase";

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
