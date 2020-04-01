import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, HashRouter } from "react-router-dom";
import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
//
import { rootReducer } from "./reducers";
import App from "./containers/App";
import { DEFAULT_API } from "./utils/api";
import { Player } from "./utils/player";
import "./index.scss";

// ------------------------------------------------------------------

const composeEnhancers =
  process.env.NODE_ENV === "development" ? composeWithDevTools({}) : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunk.withExtraArgument({
        api: DEFAULT_API,
        queuePlayer: Player(),
        previewPlayer: Player()
      })
    )
  )
);

// ------------------------------------------------------------------

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Route path="/" component={App} />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
