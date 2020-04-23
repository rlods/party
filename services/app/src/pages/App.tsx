import React, { FC, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
//
import { Room } from "./Room";
import { Splash } from "./Splash";
import { Modals } from "../components/Modals";
import { reconnectUser } from "../actions/user";
import { Dispatch } from "../actions";
import { setApp } from "../reducers/app";
import "./App.scss";

// ------------------------------------------------------------------

export const App: FC = () => {
	const dispatch = useDispatch<Dispatch>();

	const onOnlineStatusChange = useCallback(() => {
		dispatch(setApp({ online: navigator.onLine }));
	}, [dispatch]);

	useEffect(() => {
		window.addEventListener("online", onOnlineStatusChange);
		window.addEventListener("offline", onOnlineStatusChange);

		dispatch(reconnectUser());

		return () => {
			window.removeEventListener("online", onOnlineStatusChange);
			window.removeEventListener("offline", onOnlineStatusChange);
		};
	}, [dispatch, onOnlineStatusChange]);

	return (
		<div className="App">
			<Modals />
			<Switch>
				<Route
					exact={true}
					path="/room/:dbId/:roomId"
					component={Room}
				/>
				<Route exact={true} path="/" component={Splash} />
				<Redirect to="/" />
			</Switch>
		</div>
	);
};
