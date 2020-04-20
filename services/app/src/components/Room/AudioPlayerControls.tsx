import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
//
import { IconButton } from "../Common/IconButton";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { isRoomLocked, isRoomPlaying } from "../../selectors/room";
import { stopPlayer, startPlayer } from "../../actions/player";
import { moveToPreviousTrack, moveToNextTrack } from "../../actions/queue";
import { RoomInfo } from "../../utils/rooms";
import { setRoom } from "../../reducers/room";
import { generateRandomPosition } from "../../utils/player";
import { IconSize } from "../Common/Icon";
import "./AudioPlayerControls.scss";

// ------------------------------------------------------------------

export const AudioPlayerControls = ({
	className,
	propagate,
	size
}: {
	className?: string;
	propagate: boolean;
	size?: IconSize;
}) => {
	const dispatch = useDispatch<Dispatch>();

	const { t } = useTranslation();

	const locked = useSelector<RootState, boolean>(isRoomLocked);

	const playing = useSelector<RootState, boolean>(isRoomPlaying);

	const tracksCount = useSelector<RootState, number>(
		state => state.room.tracks.length
	);

	const roomInfo = useSelector<RootState, RoomInfo | null>(
		state => state.room.info
	);

	// Propagation

	const onMoveBackward_Propagate = useCallback(
		() => dispatch(moveToPreviousTrack()),
		[dispatch]
	);

	const onMoveForward_Propagate = useCallback(
		() => dispatch(moveToNextTrack()),
		[dispatch]
	);

	const onPlay_Propagate = useCallback(() => dispatch(startPlayer()), [
		dispatch
	]);

	const onStop_Propagate = useCallback(() => dispatch(stopPlayer()), [
		dispatch
	]);

	// No propagation

	const onShuffle_NoPropagate = useCallback(() => {
		if (!roomInfo || tracksCount === 0) {
			return;
		}
		dispatch(
			setRoom({
				info: {
					...roomInfo,
					playing: true,
					queue_position: generateRandomPosition() % tracksCount
				}
			})
		);
	}, [dispatch, roomInfo, tracksCount]);

	const onStop_NoPropagate = useCallback(() => {
		if (!roomInfo) {
			return;
		}
		dispatch(
			setRoom({
				info: {
					...roomInfo,
					playing: false
				}
			})
		);
	}, [dispatch, roomInfo]);

	// ...

	return (
		<div className={classNames("AudioPlayerControls", className)}>
			<div className="Control">
				<IconButton
					disabled={locked || tracksCount === 0}
					icon="step-backward"
					onClick={
						propagate
							? onMoveBackward_Propagate
							: onShuffle_NoPropagate
					}
					size={size || "M"}
					title={t("player.backward")}
				/>
			</div>
			<div className="Control">
				{!playing ? (
					<IconButton
						disabled={locked || tracksCount === 0}
						onClick={
							propagate ? onPlay_Propagate : onShuffle_NoPropagate
						}
						icon="play"
						size={size || "L"}
						title={t("player.play")}
					/>
				) : (
					<IconButton
						disabled={locked || tracksCount === 0}
						onClick={
							propagate ? onStop_Propagate : onStop_NoPropagate
						}
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
					onClick={
						propagate
							? onMoveForward_Propagate
							: onShuffle_NoPropagate
					}
					size={size || "M"}
					title={t("player.forward")}
				/>
			</div>
		</div>
	);
};
