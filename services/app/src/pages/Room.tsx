import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import classNames from "classnames";
import qs from "qs";
//
import { Head } from "../components/Room/Head";
import { Queue } from "../components/Room/Queue";
import { RoomControls } from "../components/Room/RoomControls";
import { RootState } from "../reducers";
import { CombinedColor } from "../utils/colorpicker";
import { exitRoom, enterRoom } from "../actions/room";
import { Dispatch } from "../actions";
import { RoomInfo } from "../utils/rooms";
import { SeaBattle } from "./games/SeaBattle";
import "./Room.scss";

// ------------------------------------------------------------------

export const Room = () => {
	const dispatch = useDispatch<Dispatch>();
	const { fg, bg } = useSelector<RootState, CombinedColor>(
		state => state.room.color
	);
	const info = useSelector<RootState, RoomInfo | null>(
		state => state.room.info
	);

	const { search } = useLocation();
	const { db_id, room_id } = useParams<{
		db_id: string;
		room_id: string;
	}>();

	const { secret } = qs.parse(search.substr(1)) as {
		secret?: string;
	};

	useEffect(() => {
		dispatch(enterRoom(db_id, room_id, secret || ""));

		return () => {
			dispatch(exitRoom());
		};
	}, [dispatch, db_id, room_id, secret]);

	useEffect(() => {
		document.body.className = fg;
		document.body.style.backgroundColor = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
	}, [bg, fg]);

	return (
		<div className={classNames("Room")}>
			<Head />
			{(() => {
				if (!info) {
					return null;
				}
				switch (info.type) {
					case "blind":
						return null;
					case "dj":
						return (
							<>
								<Queue />
								<RoomControls
									extended={true}
									propagate={true}
								/>
							</>
						);
					case "seabattle":
						return (
							<>
								<SeaBattle />
								<RoomControls
									extended={false}
									propagate={false}
								/>
							</>
						);
				}
			})()}
		</div>
	);
};
