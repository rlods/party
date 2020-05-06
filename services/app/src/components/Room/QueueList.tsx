import React, { memo, useContext } from "react";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../Common/IconButton";
import { LoadingIcon } from "../Common/LoadingIcon";
import { QueueItem } from "./QueueItem";
import { Track } from "../../utils/medias";
import { AppContext } from "../../pages/App";

// ------------------------------------------------------------------

export const QueueList = memo(
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

// ------------------------------------------------------------------

export const EmptyQueueList = React.memo(
	({ loaded, locked }: { loaded: boolean; locked: boolean }) => {
		const { onQueueSearch } = useContext(AppContext);
		const { t } = useTranslation();
		return (
			<div className="QueueEmpty">
				{loaded ? (
					<>
						<IconButton
							title="..."
							icon="shower"
							onClick={onQueueSearch}
							size="L"
						/>
						<span onClick={onQueueSearch}>
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
