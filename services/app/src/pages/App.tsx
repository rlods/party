import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
//
import { SeaBattle } from "./games/SeaBattle";
import { Room } from "./Room";
import { Splash } from "./Splash";
import { Modals } from "../components/Modals";
import { Messages } from "../components/App/Messages";
import { reconnectUser } from "../actions/user";
import { Dispatch } from "../actions";
import "./App.scss";

// ------------------------------------------------------------------

export const App = () => {
	const dispatch = useDispatch<Dispatch>();

	useEffect(() => {
		dispatch(reconnectUser());
	}, [dispatch]);

	return (
		<div className="App">
			<Modals />
			<Switch>
				<Route exact={true} path="/room/:room_id" component={Room} />
				<Route exact={true} path="/battle" component={SeaBattle} />
				<Route exact={true} path="/" component={Splash} />
				<Redirect to="/" />
			</Switch>
			<Messages />
		</div>
	);
};
