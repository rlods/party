import { Reducer } from "redux";
import { AxiosError } from "axios";
import { MembersAction } from "../actions/members";
import { Member } from "../utils/members";

// ------------------------------------------------------------------

export type State = {
	fetching: boolean;
	error: null | AxiosError;
	items: Member[];
};

const INITIAL_STATE: State = {
	fetching: false,
	error: null,
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
