import React, { FC, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import classNames from "classnames";
import qs from "qs";
//
import { Head } from "../components/Room/Head";
import { RootState } from "../reducers";
import { CombinedColor } from "../utils/colorpicker";
import { Dispatch } from "../actions";
import { RoomInfo } from "../utils/rooms";
import { CollaborativeQueue } from "../games/dj/page";
import { SeaBattle } from "../games/seabattle/page";
import { AppContext } from "./App";
import "./Room.scss";

// ------------------------------------------------------------------

export const Room: FC = () => {
	const { onRoomEnter, onRoomExit } = useContext(AppContext);
	const dispatch = useDispatch<Dispatch>();
	const { fg, bg } = useSelector<RootState, CombinedColor>(
		state => state.room.color
	);
	const info = useSelector<RootState, RoomInfo | null>(
		state => state.room.info
	);

	const { search } = useLocation();
	const { dbId, roomId } = useParams<{
		dbId: string;
		roomId: string;
	}>();

	const { secret = "" } = qs.parse(search.substr(1)) as {
		secret?: string;
	};

	useEffect(() => {
		onRoomEnter({ dbId, roomId, secret });

		return () => {
			onRoomExit();
		};
	}, [dispatch, dbId, roomId, secret, onRoomEnter, onRoomExit]);

	useEffect(() => {
		document.body.className = fg;
		document.body.style.backgroundColor = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
	}, [bg, fg]);

	return (
		<div className={classNames("Room")}>
			<Head />
			{(() => {
				switch (info?.type) {
					case "dj":
						return <CollaborativeQueue />;
					case "seabattle":
						return <SeaBattle />;
					default:
						return null;
				}
			})()}
		</div>
	);
};
