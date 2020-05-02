import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../Common/IconButton";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { isRoomLocked } from "../../selectors/room";
import { lockRoom } from "../../actions/room";
import { stopPlayer } from "../../actions/player";
import { confirmModal } from "../../actions/modals";
import { openModal } from "../../reducers/modals";
import { clearQueue } from "../../actions/queue";
import "./QueueControls.scss";

// ------------------------------------------------------------------

export const QueueControls: FC<{
	propagate: boolean;
	onHelp?: () => void;
}> = ({ propagate, onHelp }) => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const tracksCount = useSelector<RootState, number>(
		state => state.room.medias.length
	);
	const locked = useSelector<RootState, boolean>(isRoomLocked);
	const onClear = useCallback(() => {
		dispatch(
			confirmModal(t("rooms.confirm_clear"), () => {
				dispatch(clearQueue({ propagate }));
				dispatch(stopPlayer({ propagate }));
			})
		);
	}, [dispatch, t, propagate]);

	const onLock = useCallback(() => {
		dispatch(
			confirmModal(t("rooms.confirm_lock"), () => {
				dispatch(lockRoom());
			})
		);
	}, [dispatch, t]);

	const onUnlock = useCallback(() => {
		dispatch(openModal({ type: "Room/Unlock", props: {} }));
	}, [dispatch]);

	const onSearch = useCallback(
		() => dispatch(openModal({ type: "Room/Search", props: null })),
		[dispatch]
	);

	return (
		<div className="QueueControls">
			{onHelp ? (
				<div className="Control">
					<IconButton
						icon="question-circle"
						title={t("rooms.tutorial")}
						onClick={onHelp}
					/>
				</div>
			) : null}
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
	);
};
