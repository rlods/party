import React, { FC, useContext } from "react";
import { useSelector } from "react-redux";
//
import { QueueList, EmptyQueueList } from "./QueueList";
import { RootState } from "../../reducers";
import { selectTracks } from "../../selectors/medias";
import { Track } from "../../utils/medias";
import { selectRoomPlayerPosition } from "../../selectors/queue";
import { isRoomLoaded, isRoomLocked } from "../../selectors/room";
import { isRoomPlaying } from "../../selectors/queue";
import { AppContext } from "../../pages/AppContext";
import "./Queue.scss";

// ------------------------------------------------------------------

export const Queue: FC = () => {
	const {
		onPlayerStart,
		onPlayerStop,
		onRoomLock,
		onQueueRemove
	} = useContext(AppContext);

	const loaded = useSelector<RootState, boolean>(isRoomLoaded);
	const locked = useSelector<RootState, boolean>(isRoomLocked);
	const playing = useSelector<RootState, boolean>(isRoomPlaying);
	const playingIndex = useSelector<RootState, number>(
		selectRoomPlayerPosition
	);
	const tracks = useSelector<RootState, Array<Track | null>>(selectTracks);

	return (
		<div className="Queue">
			{tracks.length > 0 ? (
				<QueueList
					locked={locked}
					tracks={tracks}
					playing={playing}
					playingIndex={playingIndex}
					onPlay={position =>
						onPlayerStart(
							{ position },
							{
								onFailure: onRoomLock
							}
						)
					}
					onRemove={position =>
						onQueueRemove(
							{ position },
							{
								onFailure: onRoomLock
							}
						)
					}
					onStop={() =>
						onPlayerStop({
							onFailure: onRoomLock
						})
					}
				/>
			) : (
				<EmptyQueueList loaded={loaded} locked={locked} />
			)}
		</div>
	);
};
