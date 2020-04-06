import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../Common/IconButton";
import { LoadingIcon } from "../Common/LoadingIcon";
import QueueItem from "./QueueItem";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { isRoomLoaded, isRoomLocked } from "../../selectors/room";
import { extractMedias } from "../../selectors/medias";
import { Media } from "../../utils/medias";
import { startPlayer, stopPlayer } from "../../actions/player";
import { setQueuePosition, removeFromQueue } from "../../actions/queue";
import { openModal } from "../../actions/modals";
import "./Queue.scss";

// ------------------------------------------------------------------

export const Queue = () => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const { loaded, locked, medias, playing, playingIndex } = useSelector<
		RootState,
		{
			loaded: boolean;
			locked: boolean;
			medias: Array<Media | null>;
			playing: boolean;
			playingIndex: number;
		}
	>(state => ({
		loaded: isRoomLoaded(state),
		locked: isRoomLocked(state),
		medias: extractMedias(state, state.room.medias),
		playing: state.player.playing,
		playingIndex: state.room.position % state.room.medias.length
	}));

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
			{medias.length > 0 ? (
				medias.map((media, index) => (
					<QueueItem
						key={index}
						locked={locked}
						playing={playing && playingIndex === index}
						media={media}
						mediaType="track"
						onPlay={() => onPlay(index)}
						onRemove={() => onRemove(index)}
						onStop={onStop}
					/>
				))
			) : (
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
								{t(
									locked
										? "rooms.empty_for_now"
										: "rooms.empty"
								)}
							</span>
						</>
					) : (
						<>
							<LoadingIcon size="L" />
							<span>{t("rooms.loading")}</span>
						</>
					)}
				</div>
			)}
		</div>
	);
};
