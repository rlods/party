import React, { FC, useContext } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
//
import { IconButton } from "../Common/IconButton";
import { RootState } from "../../reducers";
import { isRoomLocked } from "../../selectors/room";
import { isRoomPlaying, selectRoomPlaymode } from "../../selectors/queue";
import { PlayMode } from "../../utils/rooms";
import { selectTracksCount } from "../../selectors/medias";
import { AppContext } from "../../pages/AppContext";
import "./AudioPlayerControls.scss";

// ------------------------------------------------------------------

export const AudioPlayerControls: FC<{
	bigPlayer: boolean;
	className?: string;
}> = ({ bigPlayer, className }) => {
	const {
		onQueueMoveBackward,
		onQueueMoveForward,
		onPlayerStart,
		onPlayerStop,
		onRoomLock
	} = useContext(AppContext);

	const { t } = useTranslation();

	const locked = useSelector<RootState, boolean>(isRoomLocked);

	const playing = useSelector<RootState, boolean>(isRoomPlaying);

	const tracksCount = useSelector<RootState, number>(selectTracksCount);

	const playmode = useSelector<RootState, PlayMode>(selectRoomPlaymode);

	return (
		<div className={classNames("AudioPlayerControls", className)}>
			<div className="Control">
				<IconButton
					disabled={
						!playing ||
						locked ||
						tracksCount === 0 ||
						playmode === "shuffle"
					}
					icon="step-backward"
					onClick={() => onQueueMoveBackward()}
					size={"M"}
					title={t("player.backward")}
				/>
			</div>
			<div className="Control">
				{!playing ? (
					<IconButton
						disabled={locked || tracksCount === 0}
						icon="play"
						onClick={() =>
							onPlayerStart(
								{},
								{
									onFailure: onRoomLock
								}
							)
						}
						size={bigPlayer ? "L" : "M"}
						title={t("player.play")}
					/>
				) : (
					<IconButton
						disabled={locked || tracksCount === 0}
						icon="pause"
						onClick={() =>
							onPlayerStop({
								onFailure: onRoomLock
							})
						}
						size={bigPlayer ? "L" : "M"}
						title={t("player.stop")}
					/>
				)}
			</div>
			<div className="Control">
				<IconButton
					disabled={!playing || locked || tracksCount === 0}
					icon="step-forward"
					onClick={() => onQueueMoveForward()}
					size={"M"}
					title={t("player.forward")}
				/>
			</div>
		</div>
	);
};
