import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../../../components/Modals/FormModal";
import { Icon } from "../../../components/Common/Icon";
import { IconButton } from "../../../components/Common/IconButton";
import { Dispatch } from "../../../actions";
import { popModal, openModal } from "../../../reducers/modals";
import { useHistory } from "react-router-dom";
import "./GameOverModal.scss";

// ------------------------------------------------------------------

export type SeaBattleGameOverModalProps = {
	status: "looser" | "winner";
};

// ------------------------------------------------------------------

export const SeaBattleGameOverModal: FC<SeaBattleGameOverModalProps> = ({
	status
}) => {
	const dispatch = useDispatch<Dispatch>();
	const history = useHistory();
	const { t } = useTranslation();

	const onRestart = useCallback(() => {
		dispatch(
			openModal({ type: "Room/Create", props: { type: "seabattle" } })
		);
	}, [dispatch]);

	const onExit = useCallback(() => {
		history.push("/");
		dispatch(popModal());
	}, [dispatch, history]);

	return (
		<FormModal
			className="SeaBattleGameOverModal"
			onSubmit={onRestart}
			title={t("games.gameover")}
			renderButtons={() => (
				<>
					<IconButton
						title={t("restart")}
						kind="primary"
						icon="repeat"
						type="submit"
					/>
					<IconButton
						title={t("exit")}
						icon="home"
						onClick={onExit}
					/>
				</>
			)}>
			<div>
				<Icon
					icon={status === "winner" ? "trophy" : "anchor"}
					size="L"
				/>
			</div>
			<div>
				{t(
					status === "winner"
						? "games.seabattle.you_won1"
						: "games.seabattle.you_lost1"
				)}
			</div>
			<div>
				{t(
					status === "winner"
						? "games.seabattle.you_won2"
						: "games.seabattle.you_lost2"
				)}
			</div>
		</FormModal>
	);
};
