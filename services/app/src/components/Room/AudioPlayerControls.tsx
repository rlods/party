import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
//
import { IconButton } from "../Common/IconButton";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { isRoomLocked, isRoomPlaying, selectRoom } from "../../selectors/room";
import { stopPlayer, startPlayer } from "../../actions/player";
import { moveToPreviousTrack, moveToNextTrack } from "../../actions/queue";
import { RoomInfo } from "../../utils/rooms";
import { IconSize } from "../Common/Icon";
import { selectTracksCount } from "../../selectors/medias";
import "./AudioPlayerControls.scss";

// ------------------------------------------------------------------

export const AudioPlayerControls: FC<{
	className?: string;
	propagate: boolean;
	size?: IconSize;
}> = ({ className, propagate, size }) => {
	const dispatch = useDispatch<Dispatch>();

	const { t } = useTranslation();

	const locked = useSelector<RootState, boolean>(isRoomLocked);

	const playing = useSelector<RootState, boolean>(isRoomPlaying);

	const tracksCount = useSelector<RootState, number>(selectTracksCount);

	const roomInfo = useSelector<RootState, RoomInfo | null>(selectRoom);

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
						locked ||
						tracksCount === 0 ||
						roomInfo?.playmode === "shuffle"
					}
					icon="step-backward"
					onClick={onMoveBackward}
					size={size || "M"}
					title={t("player.backward")}
				/>
			</div>
			<div className="Control">
				{!playing ? (
					<IconButton
						disabled={locked || tracksCount === 0}
						onClick={onPlay}
						icon="play"
						size={size || "L"}
						title={t("player.play")}
					/>
				) : (
					<IconButton
						disabled={locked || tracksCount === 0}
						onClick={onStop}
						icon="pause"
						title={t("player.stop")}
						size={size || "L"}
					/>
				)}
			</div>
			<div className="Control">
				<IconButton
					disabled={locked || tracksCount === 0}
					icon="step-forward"
					onClick={onMoveForward}
					size={size || "M"}
					title={t("player.forward")}
				/>
			</div>
		</div>
	);
};
