import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../Common/IconButton";
import { LoadingIcon } from "../Common/LoadingIcon";
import { QueueItem } from "./QueueItem";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import {
	isRoomLoaded,
	isRoomLocked,
	isRoomPlaying
} from "../../selectors/room";
import { selectTracks } from "../../selectors/medias";
import { Track } from "../../utils/medias";
import { startPlayer, stopPlayer } from "../../actions/player";
import { setQueuePosition, removeFromQueue } from "../../actions/queue";
import { openModal } from "../../reducers/modals";
import "./Queue.scss";

// ------------------------------------------------------------------

export const Queue: FC = () => {
	const dispatch = useDispatch<Dispatch>();
	const loaded = useSelector<RootState, boolean>(isRoomLoaded);
	const locked = useSelector<RootState, boolean>(isRoomLocked);
	const playing = useSelector<RootState, boolean>(isRoomPlaying);
	const playingIndex = useSelector<RootState, number>(state =>
		null !== state.room.info ? state.room.info.queue_position : 0
	);
	const tracks = useSelector<RootState, Array<Track | null>>(selectTracks);

	const onPlay = useCallback(
		(index: number) => {
			dispatch(startPlayer());
			dispatch(setQueuePosition(index));
		},
		[dispatch]
	);

	const onRemove = useCallback(
		(index: number) => dispatch(removeFromQueue(index)),
		[dispatch]
	);

	const onSearch = useCallback(
		() => dispatch(openModal({ type: "Search", props: null })),
		[dispatch]
	);

	const onStop = useCallback(() => dispatch(stopPlayer()), [dispatch]);

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

// ------------------------------------------------------------------

const EmptyQueueList = React.memo(
	({
		loaded,
		locked,
		onSearch
	}: {
		loaded: boolean;
		locked: boolean;
		onSearch: () => void;
	}) => {
		const { t } = useTranslation();
		return (
			<div className="QueueEmpty">
				{loaded ? (
					<>
						<IconButton
							title="..."
							icon="shower"
							onClick={onSearch}
							size="L"
						/>
						<span onClick={onSearch}>
							{t(locked ? "rooms.empty_for_now" : "rooms.empty")}
						</span>
					</>
				) : (
					<>
						<LoadingIcon size="L" />
						<span>{t("rooms.loading")}</span>
					</>
				)}
			</div>
		);
	}
);

// ------------------------------------------------------------------

const QueueList = React.memo(
	({
		locked,
		tracks,
		playing,
		playingIndex,
		onPlay,
		onRemove,
		onStop
	}: {
		locked: boolean;
		tracks: Array<Track | null>;
		playing: boolean;
		playingIndex: number;
		onPlay: (index: number) => void;
		onRemove: (index: number) => void;
		onStop: () => void;
	}) => (
		<>
			{tracks.map((track, index) => (
				<QueueItem
					key={index}
					locked={locked}
					playing={playing && playingIndex === index}
					track={track}
					onPlay={() => onPlay(index)}
					onRemove={() => onRemove(index)}
					onStop={onStop}
				/>
			))}
		</>
	)
);
