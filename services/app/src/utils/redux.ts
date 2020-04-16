import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
//
import { rootReducer, RootState } from "../reducers";
import { QUEUE_PLAYER } from "./player";

// ------------------------------------------------------------------

export const initStore = (initialState?: RootState) => {
	const composeEnhancers =
		process.env.NODE_ENV === "development"
			? composeWithDevTools({})
			: compose;

	const store = createStore(
		rootReducer,
		initialState,
		composeEnhancers(
			applyMiddleware(
				thunk.withExtraArgument({
					player: QUEUE_PLAYER
				})
			)
		)
	);

	return {
		dispatch: store.dispatch.bind(store),
		getState: store.getState.bind(store),
		store
	};
};
