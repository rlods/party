import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { AudioPlayerControls } from "./AudioPlayerControls";
import { IconButton } from "../Common/IconButton";
import { Progress } from "./Progress";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { isRoomLocked } from "../../selectors/room";
import { lockRoom } from "../../actions/room";
import { stopPlayer } from "../../actions/player";
import { confirmModal } from "../../actions/modals";
import { openModal } from "../../reducers/modals";
import { clearQueue } from "../../actions/queue";
import "./RoomControls.scss";

// ------------------------------------------------------------------

export const RoomControls = ({
	extended,
	propagate
}: {
	extended: boolean;
	propagate: boolean;
}) => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const tracksCount = useSelector<RootState, number>(
		state => state.room.medias.length
	);
	const locked = useSelector<RootState, boolean>(isRoomLocked);
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

	const onSearch = useCallback(
		() => dispatch(openModal({ type: "Search", props: null })),
		[dispatch]
	);

	return (
		<div className="RoomControls">
			<div className="ControlsInner">
				{extended ? (
					<>
						<AudioPlayerControls
							className="ControlsSet"
							propagate={propagate}
						/>
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
					</>
				) : (
					<AudioPlayerControls
						className="ControlsSet"
						propagate={propagate}
						size="S"
					/>
				)}
			</div>
		</div>
	);
};
