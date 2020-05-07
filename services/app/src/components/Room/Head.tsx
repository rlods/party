import React, { FC, useCallback, useContext } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../Common/IconButton";
import { copyToClipboard } from "../../utils/clipboard";
import { RootState } from "../../reducers";
import { isRoomLoaded, selectRoomName } from "../../selectors/room";
import { selectTracksCount } from "../../selectors/medias";
import { Icon } from "../Common/Icon";
import { AppContext } from "../../pages/AppContext";
import "./Head.scss";

// ------------------------------------------------------------------

export const Head: FC = () => {
	const { onDisplayInfo, onExit } = useContext(AppContext);
	const fetching = useSelector<RootState, boolean>(
		state => state.room.fetching
	);
	const { t } = useTranslation();
	const name = useSelector<RootState, string>(selectRoomName);
	const loaded = useSelector<RootState, boolean>(isRoomLoaded);
	const mediasCount = useSelector<RootState, number>(
		state => state.room.data.medias.length
	);
	const tracksCount = useSelector<RootState, number>(selectTracksCount);

	const onCopy = useCallback(async () => {
		await copyToClipboard(document.location.href.split("?")[0]);
		onDisplayInfo("rooms.link_copied_to_clipboard");
	}, [onDisplayInfo]);

	return (
		<div className="Head">
			<div className="HeadInner">
				<div className="RoomLink">
					<IconButton
						icon="link"
						onClick={onCopy}
						size="M"
						title={t("rooms.copy_link")}
					/>
				</div>
				<div className="RoomMeta">
					{fetching ? (
						<Icon
							className="rotating"
							icon="refresh"
							title={t("loading")}
						/>
					) : loaded ? (
						<>
							<div
								className="RoomName"
								title={`${t("rooms.media_count", {
									count: mediasCount
								})} / ${t("rooms.track_count", {
									count: tracksCount
								})}`}>
								{name}
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
		</div>
	);
};
