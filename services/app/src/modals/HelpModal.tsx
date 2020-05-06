import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
//
import { Modal } from "./Modal";
import { IconButton } from "../components/Common/IconButton";
import { AppContext } from "../pages/AppContext";
import { DEFAULT_ROOM_TYPE } from "../utils/rooms";
import "./HelpModal.scss";

// ------------------------------------------------------------------

export const HelpModal: FC = () => {
	const {
		onRoomCreateAsk,
		onRoomJoinAsk,
		onUserConnectAsk,
		onUserCreateAsk
	} = useContext(AppContext);
	const { t } = useTranslation();

	return (
		<Modal className="HelpModal" title={t("help.help")}>
			<div className="HelpModalSection">
				<div className="HelpModalSectionTitle">{t("help.rules")}</div>
				<ul>
					<li>
						{t("help.rule1")}&nbsp;
						<IconButton
							icon="user-plus"
							size="S"
							title={t("user.create")}
							onClick={onUserCreateAsk}
						/>
					</li>
					<li>
						{t("help.rule1b")}&nbsp;
						<IconButton
							icon="sign-in"
							size="S"
							title={t("user.connect")}
							onClick={onUserConnectAsk}
						/>
					</li>
					<li>
						{t("help.rule2")}&nbsp;
						<IconButton
							icon="play"
							size="S"
							title={t("rooms.create")}
							onClick={() => onRoomCreateAsk(DEFAULT_ROOM_TYPE)}
						/>
					</li>
					<li>
						{t("help.rule2b")}&nbsp;
						<IconButton
							icon="sign-in"
							size="S"
							title={t("rooms.join")}
							onClick={onRoomJoinAsk}
						/>
					</li>
				</ul>
			</div>

			<div className="HelpModalSection">
				<div className="HelpModalSectionTitle">{t("help.notes")}</div>
				<ul>
					<li>{t("help.note1")}</li>
					<li>{t("help.note2")}</li>
					<li>{t("help.note3")}</li>
				</ul>
			</div>
		</Modal>
	);
};
