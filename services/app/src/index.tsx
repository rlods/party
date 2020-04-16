import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, HashRouter } from "react-router-dom";
//
import { App } from "./pages/App";
import { initLocales } from "./utils/i18n";
import { register as registerServiceWorker } from "./serviceWorker";
import { initStore } from "./utils/redux";
import "./index.scss";

// ------------------------------------------------------------------

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
registerServiceWorker();

// ------------------------------------------------------------------

const init = async () => {
	initLocales();
	return initStore();
};

// ------------------------------------------------------------------

init().then(({ store }) => {
	ReactDOM.render(
		<Provider store={store}>
			<HashRouter>
				<Route path="/" component={App} />
			</HashRouter>
		</Provider>,
		document.getElementById("root")
	);
});
