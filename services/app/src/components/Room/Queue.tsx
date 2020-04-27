import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
//
import { QueueList, EmptyQueueList } from "./QueueList";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { selectTracks } from "../../selectors/medias";
import { Track } from "../../utils/medias";
import { startPlayer, stopPlayer } from "../../actions/player";
import { setQueuePosition, removeFromQueue } from "../../actions/queue";
import { openModal } from "../../reducers/modals";
import { selectQueuePosition } from "../../selectors/queue";
import { isRoomLoaded, isRoomLocked } from "../../selectors/room";
import { isRoomPlaying } from "../../selectors/queue";
import "./Queue.scss";

// ------------------------------------------------------------------

export const Queue: FC = () => {
	const dispatch = useDispatch<Dispatch>();

	const loaded = useSelector<RootState, boolean>(isRoomLoaded);
	const locked = useSelector<RootState, boolean>(isRoomLocked);
	const playing = useSelector<RootState, boolean>(isRoomPlaying);
	const playingIndex = useSelector<RootState, number>(selectQueuePosition);
	const tracks = useSelector<RootState, Array<Track | null>>(selectTracks);

	const onPlay = useCallback(
		(position: number) => {
			dispatch(startPlayer({ propagate: true }));
			dispatch(setQueuePosition({ position, propagate: true }));
		},
		[dispatch]
	);

	const onRemove = useCallback(
		(position: number) => dispatch(removeFromQueue({ position })),
		[dispatch]
	);

	const onSearch = useCallback(
		() => dispatch(openModal({ type: "Search", props: null })),
		[dispatch]
	);

	const onStop = useCallback(
		() => dispatch(stopPlayer({ propagate: true })),
		[dispatch]
	);

	return (
		<div className="Queue">
			{tracks.length > 0 ? (
				<QueueList
					locked={locked}
					tracks={tracks}
					playing={playing}
					playingIndex={playingIndex}
					onPlay={onPlay}
					onRemove={onRemove}
					onStop={onStop}
				/>
			) : (
				<EmptyQueueList
					loaded={loaded}
					locked={locked}
					onSearch={onSearch}
				/>
			)}
		</div>
	);
};
