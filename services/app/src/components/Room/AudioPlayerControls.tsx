import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
//
import { IconButton } from "../Common/IconButton";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { isRoomLocked } from "../../selectors/room";
import { isRoomPlaying, selectRoomPlaymode } from "../../selectors/queue";
import { stopPlayer, startPlayer } from "../../actions/player";
import { moveToPreviousTrack, moveToNextTrack } from "../../actions/queue";
import { PlayMode } from "../../utils/rooms";
import { selectTracksCount } from "../../selectors/medias";
import "./AudioPlayerControls.scss";

// ------------------------------------------------------------------

export const AudioPlayerControls: FC<{
	bigPlayer: boolean;
	className?: string;
	propagate: boolean;
}> = ({ bigPlayer, className, propagate }) => {
	const dispatch = useDispatch<Dispatch>();

	const { t } = useTranslation();

	const locked = useSelector<RootState, boolean>(isRoomLocked);

	const playing = useSelector<RootState, boolean>(isRoomPlaying);

	const tracksCount = useSelector<RootState, number>(selectTracksCount);

	const playmode = useSelector<RootState, PlayMode>(selectRoomPlaymode);

	const onMoveBackward = useCallback(
		() => dispatch(moveToPreviousTrack({ propagate })),
		[dispatch, propagate]
	);

	const onMoveForward = useCallback(
		() => dispatch(moveToNextTrack({ propagate })),
		[dispatch, propagate]
	);

	const onPlay = useCallback(() => dispatch(startPlayer({ propagate })), [
		dispatch,
		propagate
	]);

	const onStop = useCallback(() => dispatch(stopPlayer({ propagate })), [
		dispatch,
		propagate
	]);

	return (
		<div className={classNames("AudioPlayerControls", className)}>
			<div className="Control">
				<IconButton
					disabled={
						locked || tracksCount === 0 || playmode === "shuffle"
					}
					icon="step-backward"
					onClick={onMoveBackward}
					size={"M"}
					title={t("player.backward")}
				/>
			</div>
			<div className="Control">
				{!playing ? (
					<IconButton
						disabled={locked || tracksCount === 0}
						icon="play"
						onClick={onPlay}
						size={bigPlayer ? "L" : "M"}
						title={t("player.play")}
					/>
				) : (
					<IconButton
						disabled={locked || tracksCount === 0}
						icon="pause"
						onClick={onStop}
						size={bigPlayer ? "L" : "M"}
						title={t("player.stop")}
					/>
				)}
			</div>
			<div className="Control">
				<IconButton
					disabled={locked || tracksCount === 0}
					icon="step-forward"
					onClick={onMoveForward}
					size={"M"}
					title={t("player.forward")}
				/>
			</div>
		</div>
	);
};
