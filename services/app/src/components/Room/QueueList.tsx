import React, { memo } from "react";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../Common/IconButton";
import { LoadingIcon } from "../Common/LoadingIcon";
import { QueueItem } from "./QueueItem";
import { Track } from "../../utils/medias";

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
