import { Reducer } from "redux";
import { AxiosError } from "axios";
//
import { createAction } from "../../actions";
import { SeaBattleData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

type SeaBattleAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof error>
	| ReturnType<typeof reset>
	| ReturnType<typeof set>;

export const fetching = () => createAction("games/seabattle/FETCHING");
export const error = (error: AxiosError) =>
	createAction("games/seabattle/ERROR", error);
export const reset = () => createAction("games/seabattle/RESET", error);
export const set = (data: SeaBattleData) =>
	createAction("games/seabattle/SET", data);

// ------------------------------------------------------------------

export type State = {
	fetching: boolean;
	error: null | AxiosError;
	battle: SeaBattleData;
};

const INITIAL_STATE: State = {
	error: null,
	fetching: false,
	battle: { currentMapIndex: 0, maps: [] }
};

// ------------------------------------------------------------------

export const seabattleReducer: Reducer<State, SeaBattleAction> = (
	state = { ...INITIAL_STATE },
	action: SeaBattleAction
): State => {
	switch (action.type) {
		case "games/seabattle/FETCHING":
			return {
				...state,
				fetching: true,
				error: null
			};
		case "games/seabattle/ERROR":
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		case "games/seabattle/SET":
			return {
				...state,
				battle: action.payload,
				fetching: false,
				error: null
			};
		case "games/seabattle/RESET":
			return INITIAL_STATE;
		default:
			return state;
	}
};
