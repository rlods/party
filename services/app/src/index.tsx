import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, HashRouter } from "react-router-dom";
import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
//
import { rootReducer } from "./reducers";
import { App } from "./pages/App";
import { DEFAULT_API } from "./utils/deezer";
import { Player } from "./utils/player";
import { initLocales } from "./utils/i18n";
import "./index.scss";

// ------------------------------------------------------------------

const init = async () => {
	const composeEnhancers =
		process.env.NODE_ENV === "development"
			? composeWithDevTools({})
			: compose;

	const deezer = DEFAULT_API;
	const queuePlayer = Player(true);
	const previewPlayer = Player(false);
	initLocales();

	const store = createStore(
		rootReducer,
		composeEnhancers(
			applyMiddleware(
				thunk.withExtraArgument({ deezer, queuePlayer, previewPlayer })
			)
		)
	);

	// const dispatch: Dispatch = store.dispatch.bind(store);

	return store;
};

// ------------------------------------------------------------------

init().then(store => {
	ReactDOM.render(
		<Provider store={store}>
			<HashRouter>
				<Route path="/" component={App} />
			</HashRouter>
		</Provider>,
		document.getElementById("root")
	);
});
