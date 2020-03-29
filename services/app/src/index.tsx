import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Router } from "react-router-dom";
import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
//
import { rootReducer } from "./reducers";
import history from "./utils/history";
import App from "./containers/App";

// ------------------------------------------------------------------

const composeEnhancers =
  process.env.NODE_ENV === "development" ? composeWithDevTools({}) : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById("root")
);
