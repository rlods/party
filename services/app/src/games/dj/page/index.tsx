import React, { FC, useEffect, useContext } from "react";
//
import { Queue } from "../../../components/Room/Queue";
import { RoomControls } from "../../../components/Room/RoomControls";
import { Messages } from "../../../components/Common/Messages";
import { AppContext } from "../../../pages/AppContext";

// ------------------------------------------------------------------

export const CollaborativeQueue: FC = () => {
	const { onPlayerSetPropagate } = useContext(AppContext);

	useEffect(() => {
		onPlayerSetPropagate(true);

		return () => {
			onPlayerSetPropagate(false);
		};
	});

	return (
		<>
			<Queue />
			<RoomControls extended={true} />
			<Messages bottomPosition="120px" />
		</>
	);
};
