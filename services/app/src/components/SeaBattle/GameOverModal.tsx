import React, { FC } from "react";
import { useTranslation } from "react-i18next";
//
import { Modal } from "../Modals/Modal";

// ------------------------------------------------------------------

export const SeaBattleGameOverModal: FC = () => {
	const { t } = useTranslation();
	return (
		<Modal className="SeaBattleGameOverModal" title={t("games.gameover")}>
			GameOver...
		</Modal>
	);
};
