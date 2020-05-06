import React, { FC, useContext } from "react";
import { useSelector } from "react-redux";
//
import { QueueList, EmptyQueueList } from "./QueueList";
import { RootState } from "../../reducers";
import { selectTracks } from "../../selectors/medias";
import { Track } from "../../utils/medias";
import { selectQueuePosition } from "../../selectors/queue";
import { isRoomLoaded, isRoomLocked } from "../../selectors/room";
import { isRoomPlaying } from "../../selectors/queue";
import { AppContext } from "../../pages/App";
import "./Queue.scss";

// ------------------------------------------------------------------

export const Queue: FC = () => {
	const { onPlayerStop, onQueueRemove, onQueueSetPosition } = useContext(
		AppContext
	);

	const loaded = useSelector<RootState, boolean>(isRoomLoaded);
	const locked = useSelector<RootState, boolean>(isRoomLocked);
	const playing = useSelector<RootState, boolean>(isRoomPlaying);
	const playingIndex = useSelector<RootState, number>(selectQueuePosition);
	const tracks = useSelector<RootState, Array<Track | null>>(selectTracks);

	return (
		<div className="Queue">
			{tracks.length > 0 ? (
				<QueueList
					locked={locked}
					tracks={tracks}
					playing={playing}
					playingIndex={playingIndex}
					onPlay={position => onQueueSetPosition(true, position)}
					onRemove={position => onQueueRemove(true, position)}
					onStop={() => onPlayerStop(true)}
				/>
			) : (
				<EmptyQueueList loaded={loaded} locked={locked} />
			)}
		</div>
	);
};
