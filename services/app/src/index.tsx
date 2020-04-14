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
import { QUEUE_PLAYER } from "./utils/player";
import { initLocales } from "./utils/i18n";
import { register as registerServiceWorker } from "./serviceWorker";
import "./index.scss";

// ------------------------------------------------------------------

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
registerServiceWorker();

// ------------------------------------------------------------------

const init = async () => {
	const composeEnhancers =
		process.env.NODE_ENV === "development"
			? composeWithDevTools({})
			: compose;

	initLocales();

	const store = createStore(
		rootReducer,
		composeEnhancers(
			applyMiddleware(
				thunk.withExtraArgument({
					deezer: DEFAULT_API,
					player: QUEUE_PLAYER
				})
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
