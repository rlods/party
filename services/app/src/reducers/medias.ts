import { Reducer } from "redux";
import { StructuredMedias, Media } from "../utils/medias";
import { createAction } from "../actions";

// ------------------------------------------------------------------

type MediasAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof error>
	| ReturnType<typeof resetMedias>
	| ReturnType<typeof setMedias>;

export const fetching = () => createAction("medias/FETCHING");
export const error = (error: string) => createAction("medias/ERROR", error);
export const resetMedias = () => createAction("medias/RESET");
export const setMedias = (medias: Media[]) =>
	createAction("medias/SET", medias);

// ------------------------------------------------------------------

export type State = {
	error: null | string;
	fetching: boolean;
	medias: StructuredMedias;
};

const INITIAL_STATE: State = {
	error: null,
	fetching: false,
	medias: {
		// keys are ProvideType
		deezer: {
			// keys are MediaType
			album: {},
			playlist: {},
			track: {}
		}
	}
};

// ------------------------------------------------------------------

export const mediasReducer: Reducer<State, MediasAction> = (
	state = INITIAL_STATE,
	action: MediasAction
): State => {
	switch (action.type) {
		case "medias/FETCHING":
			return {
				...state,
				fetching: true,
				error: null
			};
		case "medias/ERROR":
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		case "medias/SET": {
			const copy = {
				...state,
				fetching: false,
				error: null,
				medias: {
					// keys are ProvideType
					deezer: {
						// keys are MediaType
						album: { ...state.medias.deezer.album },
						playlist: { ...state.medias.deezer.playlist },
						track: { ...state.medias.deezer.track }
					}
				}
			};
			for (const media of action.payload) {
				copy.medias[media.provider][media.type][media.id] = media;
			}
			return copy;
		}
		case "medias/RESET":
			return INITIAL_STATE;
		default:
			return state;
	}
};
