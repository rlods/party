import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../Common/IconButton";
import { Progress } from "./Progress";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { isRoomLocked, isRoomPlaying } from "../../selectors/room";
import { lockRoom } from "../../actions/room";
import { stopPlayer, startPlayer } from "../../actions/player";
import { confirmModal } from "../../actions/modals";
import { openModal } from "../../reducers/modals";
import {
	clearQueue,
	moveToPreviousTrack,
	moveToNextTrack
} from "../../actions/queue";
import "./Controls.scss";

// ------------------------------------------------------------------

export const Controls = () => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const tracksCount = useSelector<RootState, number>(
		state => state.room.medias.length
	);
	const locked = useSelector<RootState, boolean>(isRoomLocked);
	const playing = useSelector<RootState, boolean>(isRoomPlaying);
	const onClear = useCallback(() => {
		dispatch(
			confirmModal(t("rooms.confirm_clear"), () => {
				dispatch(clearQueue());
				dispatch(stopPlayer());
			})
		);
	}, [dispatch, t]);

	const onLock = useCallback(() => {
		dispatch(
			confirmModal(t("rooms.confirm_lock"), () => {
				dispatch(lockRoom());
			})
		);
	}, [dispatch, t]);

	const onUnlock = useCallback(() => {
		dispatch(openModal({ type: "UnlockRoom", props: null }));
	}, [dispatch]);

	const onMoveBackward = useCallback(() => dispatch(moveToPreviousTrack()), [
		dispatch
	]);

	const onMoveForward = useCallback(() => dispatch(moveToNextTrack()), [
		dispatch
	]);

	const onPlay = useCallback(() => dispatch(startPlayer()), [dispatch]);

	const onSearch = useCallback(
		() => dispatch(openModal({ type: "Search", props: null })),
		[dispatch]
	);

	const onStop = useCallback(() => dispatch(stopPlayer()), [dispatch]);

	return (
		<div className="Controls">
			<div className="ControlsInner">
				<div className="ControlsSet PlayerControlsSet">
					<div className="Control">
						<IconButton
							disabled={locked || tracksCount === 0}
							icon="step-backward"
							onClick={onMoveBackward}
							size="M"
							title={t("player.backward")}
						/>
					</div>
					<div className="Control">
						{!playing ? (
							<IconButton
								disabled={locked || tracksCount === 0}
								onClick={onPlay}
								icon="play"
								size="L"
								title={t("player.play")}
							/>
						) : (
							<IconButton
								disabled={locked || tracksCount === 0}
								onClick={onStop}
								icon="pause"
								title={t("player.stop")}
								size="L"
							/>
						)}
					</div>
					<div className="Control">
						<IconButton
							disabled={locked || tracksCount === 0}
							icon="step-forward"
							onClick={onMoveForward}
							size="M"
							title={t("player.forward")}
						/>
					</div>
				</div>
				<Progress />
				<div className="ControlsSet RoomControlsSet">
					<div className="Control">
						{locked ? (
							<IconButton
								icon="lock"
								onClick={onUnlock}
								size="M"
								title={t("rooms.locked")}
							/>
						) : (
							<IconButton
								icon="unlock"
								onClick={onLock}
								size="M"
								title={t("rooms.unlocked")}
							/>
						)}
					</div>
					<div className="Control">
						<IconButton
							onClick={onSearch}
							icon="search"
							title={t("medias.search")}
						/>
					</div>
					<div className="Control">
						<IconButton
							disabled={locked || tracksCount === 0}
							onClick={onClear}
							icon="trash"
							title={t("rooms.clear")}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
