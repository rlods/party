import React, { FC, useContext } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../Common/IconButton";
import { RootState } from "../../reducers";
import { isRoomLocked } from "../../selectors/room";
import { AppContext } from "../../pages/AppContext";
import "./QueueControls.scss";

// ------------------------------------------------------------------

export const QueueControls: FC<{
	propagate: boolean;
	onHelp?: () => void;
}> = ({ propagate, onHelp }) => {
	const {
		onQueueClear,
		onQueueSearch,
		onRoomLock,
		onRoomUnlockAsk
	} = useContext(AppContext);
	const { t } = useTranslation();
	const tracksCount = useSelector<RootState, number>(
		state => state.room.data.medias.length
	);
	const locked = useSelector<RootState, boolean>(isRoomLocked);

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
						onClick={onRoomUnlockAsk}
						size="M"
						title={t("rooms.locked")}
					/>
				) : (
					<IconButton
						icon="unlock"
						onClick={onRoomLock}
						size="M"
						title={t("rooms.unlocked")}
					/>
				)}
			</div>
			<div className="Control">
				<IconButton
					onClick={onQueueSearch}
					icon="search"
					title={t("medias.search")}
				/>
			</div>
			<div className="Control">
				<IconButton
					disabled={locked || tracksCount === 0}
					onClick={() =>
						onQueueClear(propagate, {
							onFailure: onRoomLock
						})
					}
					icon="trash"
					title={t("rooms.clear")}
				/>
			</div>
		</div>
	);
};
