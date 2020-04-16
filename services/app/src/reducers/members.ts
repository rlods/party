import { Reducer } from "redux";
import { AxiosError } from "axios";
import { Member } from "../utils/members";
import { createAction } from "../actions";

// ------------------------------------------------------------------

type MembersAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof success>
	| ReturnType<typeof error>
	| ReturnType<typeof reset>;

export const fetching = () => createAction("members/FETCHING");
export const success = (members: Member[]) =>
	createAction("members/FETCHED", members);
export const error = (error: AxiosError) =>
	createAction("members/ERROR", error);
export const reset = () => createAction("members/RESET");

// ------------------------------------------------------------------

export type State = {
	error: null | AxiosError;
	fetching: boolean;
	items: Member[];
};

const INITIAL_STATE: State = {
	error: null,
	fetching: false,
	items: []
};

// ------------------------------------------------------------------

export const membersReducer: Reducer<State, MembersAction> = (
	state = INITIAL_STATE,
	action: MembersAction
): State => {
	switch (action.type) {
		case "members/FETCHING":
			return {
				...state,
				fetching: true,
				error: null
			};
		case "members/FETCHED": {
			const items = [...state.items];
			//TODO for (const item of action.payload) {
			//  items[item.id] = item;
			//}
			return {
				...state,
				fetching: false,
				error: null,
				items
			};
		}
		case "members/ERROR":
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		case "members/RESET":
			return INITIAL_STATE;
		default:
			return state;
	}
};
