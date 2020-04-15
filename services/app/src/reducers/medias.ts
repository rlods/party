import { Reducer } from "redux";
import { AxiosError } from "axios";
import { MediasAction } from "../actions/medias";
import { StructuredMedias } from "../utils/medias";

// ------------------------------------------------------------------

export type State = {
	error: null | AxiosError;
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
		case "medias/FETCHED": {
			return {
				...state,
				fetching: false,
				error: null
			};
		}
		case "medias/ERROR":
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		case "medias/SET": {
			const copy = {
				...state,
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
