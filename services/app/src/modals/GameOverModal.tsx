import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
//
import { FormModal } from "./FormModal";
import { Icon } from "../components/Common/Icon";
import { IconButton } from "../components/Common/IconButton";
import { Dispatch } from "../actions";
import { popModal, openModal } from "../reducers/modals";
import { RoomType } from "../utils/rooms";
import "./GameOverModal.scss";

// ------------------------------------------------------------------

export type GameOverModalProps = {
	roomType: RoomType;
	status: "looser" | "winner";
};

// ------------------------------------------------------------------

export const GameOverModal: FC<GameOverModalProps> = ({ roomType, status }) => {
	const dispatch = useDispatch<Dispatch>();
	const history = useHistory();
	const { t } = useTranslation();

	const onRestart = useCallback(() => {
		dispatch(openModal({ type: "Room/Create", props: { type: roomType } }));
	}, [dispatch, roomType]);

	const onExit = useCallback(() => {
		history.push("/");
		dispatch(popModal());
	}, [dispatch, history]);

	return (
		<FormModal
			className="GameOverModal"
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
				{t(status === "winner" ? "games.you_won" : "games.you_lost")}
			</div>
			<div>
				{t(
					status === "winner"
						? "games.seabattle.you_won"
						: "games.seabattle.you_lost"
				)}
			</div>
		</FormModal>
	);
};
