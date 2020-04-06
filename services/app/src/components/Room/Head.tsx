import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../Common/IconButton";
import history from "../../utils/history";
import { copyToClipboard } from "../../utils/clipboard";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { extractRoom } from "../../selectors/room";
import { displayMessage } from "../../actions/messages";
import { confirmModal } from "../../actions/modals";
import { RoomInfo } from "../../utils/rooms";
import "./Head.scss";

// ------------------------------------------------------------------

export const Head = () => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();

	const { room } = useSelector<RootState, { room: RoomInfo | null }>(
		state => ({
			room: extractRoom(state)
		})
	);

	const onCopy = useCallback(async () => {
		await copyToClipboard(document.location.href.split("?")[0]);
		dispatch(displayMessage("info", t("rooms.link_copied_to_clipboard")));
	}, [t, dispatch]);

	const onExit = useCallback(() => {
		dispatch(
			confirmModal(t("rooms.confirm_exit"), () => {
				history.push("/");
			})
		);
	}, [t, dispatch]);

	return (
		<div className="Head">
			<div className="RoomLink">
				<IconButton
					icon="link"
					onClick={onCopy}
					size="M"
					title={t("rooms.copy_link")}
				/>
			</div>
			<div className="RoomName">{room ? room.name : ""}</div>
			<div className="RoomExit">
				<IconButton
					onClick={onExit}
					icon="sign-out"
					size="M"
					title={t("rooms.exit")}
				/>
			</div>
		</div>
	);
};
