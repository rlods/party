import React, { FC, useEffect } from "react";
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
import { Messages } from "../components/Common/Messages";
import { openModal } from "../reducers/modals";
import "./Room.scss";

// ------------------------------------------------------------------

export const Room: FC = () => {
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
		dispatch(enterRoom({ dbId, roomId, secret }));

		return () => {
			dispatch(exitRoom());
		};
	}, [dispatch, dbId, roomId, secret]);

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
								<Messages
									className="QueueMessages"
									bottomPosition="120px"
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
									onHelp={() => {
										dispatch(
											openModal({
												type: "SeaBattleHelp",
												props: null
											})
										);
									}}
								/>
								<Messages
									className="SeaBattleMessages"
									bottomPosition="50px"
								/>
							</>
						);
				}
			})()}
		</div>
	);
};
