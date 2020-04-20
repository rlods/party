import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
//
import { Modal } from "../Modals/Modal";
import { openModal } from "../../reducers/modals";
import { Dispatch } from "../../actions";
import { IconButton } from "../Common/IconButton";
import "./HelpModal.scss";

// ------------------------------------------------------------------

export const HelpModal = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch<Dispatch>();

	const onCreateRoom = useCallback(
		() => dispatch(openModal({ type: "CreateRoom", props: null })),
		[dispatch]
	);

	const onJoinRoom = useCallback(
		() => dispatch(openModal({ type: "JoinRoom", props: null })),
		[dispatch]
	);

	const onCreateUser = useCallback(
		() => dispatch(openModal({ type: "CreateUser", props: {} })),
		[dispatch]
	);

	const onConnectUser = useCallback(
		() => dispatch(openModal({ type: "ConnectUser", props: {} })),
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
							icon="plus"
							size="S"
							title=""
							onClick={onCreateUser}
						/>
						<br />
						{t("help.rule1b")}&nbsp;
						<IconButton
							icon="sign-in"
							size="S"
							title=""
							onClick={onConnectUser}
						/>
					</li>
					<li>
						{t("help.rule2")}&nbsp;
						<IconButton
							icon="plus"
							size="S"
							title=""
							onClick={onCreateRoom}
						/>
						<br />
						{t("help.rule2b")}&nbsp;
						<IconButton
							icon="sign-in"
							size="S"
							title=""
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
