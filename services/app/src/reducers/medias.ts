import { Reducer } from "redux";
import { StructuredMedias, Media } from "../utils/medias";
import { createAction } from "../actions";

// ------------------------------------------------------------------

type MediasAction =
	| ReturnType<typeof fetchingMedias>
	| ReturnType<typeof error>
	| ReturnType<typeof resetMedias>
	| ReturnType<typeof setMedias>;

export const fetchingMedias = () => createAction("medias/FETCHING");
export const error = (error: string) => createAction("medias/ERROR", error);
export const resetMedias = () => createAction("medias/RESET");
export const setMedias = (medias: ReadonlyArray<Media>) =>
	createAction("medias/SET", medias);

// ------------------------------------------------------------------

export type State = Readonly<{
	data: StructuredMedias;
	error: null | string;
	fetching: boolean;
}>;

export const INITIAL_STATE: State = {
	data: {
		deezer: {
			album: {},
			playlist: {},
			track: {}
		},
		spotify: {
			album: {},
			playlist: {},
			track: {}
		}
	},
	error: null,
	fetching: false
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
			const copy: State = {
				...state,
				data: {
					deezer: {
						album: { ...state.data.deezer.album },
						playlist: { ...state.data.deezer.playlist },
						track: { ...state.data.deezer.track }
					},
					spotify: {
						album: { ...state.data.spotify.album },
						playlist: { ...state.data.spotify.playlist },
						track: { ...state.data.spotify.track }
					}
				},
				error: null,
				fetching: false
			};
			for (const media of action.payload) {
				copy.data[media.provider][media.type][media.id] = media;
			}
			return copy;
		}
		case "medias/RESET":
			return INITIAL_STATE;
		default:
			return state;
	}
};
