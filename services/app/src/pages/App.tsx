import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
//
import { Room } from "./Room";
import { Splash } from "./Splash";
import { Modals } from "../components/Modals";
import { reconnectUser } from "../actions/user";
import { Dispatch } from "../actions";
import "./App.scss";

// ------------------------------------------------------------------

export const App: FC = () => {
	const dispatch = useDispatch<Dispatch>();

	useEffect(() => {
		dispatch(reconnectUser());
	}, [dispatch]);

	return (
		<div className="App">
			<Modals />
			<Switch>
				<Route
					exact={true}
					path="/room/:db_id/:room_id"
					component={Room}
				/>
				<Route exact={true} path="/" component={Splash} />
				<Redirect to="/" />
			</Switch>
		</div>
	);
};
