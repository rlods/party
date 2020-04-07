import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import classNames from "classnames";
import qs from "qs";
//
import { Head } from "../components/Room/Head";
import { Queue } from "../components/Room/Queue";
import { Controls } from "../components/Room/Controls";
import { RootState } from "../reducers";
import { CombinedColor } from "../utils/colorpicker";
import { exitRoom, enterRoom } from "../actions/room";
import { Dispatch } from "../actions";
import "./Room.scss";

// ------------------------------------------------------------------

export const Room = () => {
	const dispatch = useDispatch<Dispatch>();
	const {
		color: { fg, bg }
	} = useSelector<RootState, { color: CombinedColor }>(state => ({
		color: state.room.color
	}));

	const { search } = useLocation();
	const { room_id } = useParams<{
		room_id: string;
	}>();

	const { secret } = qs.parse(search.substr(1)) as {
		secret?: string;
	};

	useEffect(() => {
		dispatch(enterRoom(room_id, secret || ""));

		return () => {
			dispatch(exitRoom());
		};
	}, [dispatch, room_id, secret]);

	return (
		<div
			className={classNames("Room", fg)}
			style={{
				backgroundColor: `rgb(${bg.r}, ${bg.g}, ${bg.b})`
			}}>
			<Head />
			<Queue />
			<Controls />
		</div>
	);
};
