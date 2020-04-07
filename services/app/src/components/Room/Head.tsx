import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
//
import { IconButton } from "../Common/IconButton";
import { copyToClipboard } from "../../utils/clipboard";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { extractRoom } from "../../selectors/room";
import { displayInfo } from "../../actions/messages";
import { confirmModal } from "../../actions/modals";
import { RoomInfo } from "../../utils/rooms";
import "./Head.scss";

// ------------------------------------------------------------------

export const Head = () => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const history = useHistory();
	const room = useSelector<RootState, RoomInfo | null>(extractRoom);
	const tracksCount = useSelector<RootState, number>(
		state => state.room.medias.length
	);

	const onCopy = useCallback(async () => {
		await copyToClipboard(document.location.href.split("?")[0]);
		dispatch(displayInfo("rooms.link_copied_to_clipboard"));
	}, [dispatch]);

	const onExit = useCallback(() => {
		dispatch(
			confirmModal(t("rooms.confirm_exit"), () => {
				history.push("/");
			})
		);
	}, [t, dispatch, history]);

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
			<div className="RoomMeta">
				{room ? (
					<>
						<div className="RoomName">{room.name}</div>
						<div className="RoomSize">
							&nbsp;--&nbsp;
							{t("rooms.track_count", { count: tracksCount })}
						</div>
					</>
				) : null}
			</div>
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
