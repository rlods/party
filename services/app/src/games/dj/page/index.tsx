import React, { FC } from "react";
//
import { Queue } from "../../../components/Room/Queue";
import { RoomControls } from "../../../components/Room/RoomControls";
import { Messages } from "../../../components/Common/Messages";

// ------------------------------------------------------------------

export const CollaborativeQueue: FC = () => (
	<>
		<Queue />
		<RoomControls extended={true} propagate={true} />
		<Messages bottomPosition="120px" />
	</>
);
