import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
//
import { Modal } from "../Modals/Modal";
import { openModal } from "../../reducers/modals";
import { Dispatch } from "../../actions";
import { IconButton } from "../Common/IconButton";
import "./HelpModal.scss";

// ------------------------------------------------------------------

export const HelpModal: FC = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch<Dispatch>();

	const onCreateRoom = useCallback(
		() => dispatch(openModal({ type: "Room/Create", props: null })),
		[dispatch]
	);

	const onJoinRoom = useCallback(
		() => dispatch(openModal({ type: "Room/Join", props: null })),
		[dispatch]
	);

	const onCreateUser = useCallback(
		() => dispatch(openModal({ type: "User/Create", props: {} })),
		[dispatch]
	);

	const onConnectUser = useCallback(
		() => dispatch(openModal({ type: "User/Connect", props: {} })),
		[dispatch]
	);

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
							onClick={onCreateUser}
						/>
					</li>
					<li>
						{t("help.rule1b")}&nbsp;
						<IconButton
							icon="sign-in"
							size="S"
							title={t("user.connect")}
							onClick={onConnectUser}
						/>
					</li>
					<li>
						{t("help.rule2")}&nbsp;
						<IconButton
							icon="play"
							size="S"
							title={t("rooms.create")}
							onClick={onCreateRoom}
						/>
					</li>
					<li>
						{t("help.rule2b")}&nbsp;
						<IconButton
							icon="sign-in"
							size="S"
							title={t("rooms.join")}
							onClick={onJoinRoom}
						/>
					</li>
				</ul>
			</div>

			<div className="HelpModalSection">
				<div className="HelpModalSectionTitle">{t("help.notes")}</div>
				<ul>
					<li>{t("help.note1")}</li>
					<li>{t("help.note2")}</li>
				</ul>
			</div>
		</Modal>
	);
};
