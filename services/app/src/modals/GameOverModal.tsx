import React, { FC, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
//
import { FormModal } from "./FormModal";
import { Icon } from "../components/Common/Icon";
import { IconButton } from "../components/Common/IconButton";
import { RoomType } from "../utils/rooms";
import { AppContext } from "../pages/AppContext";
import { CommonContext } from "../components/Common/CommonContext";
import "./GameOverModal.scss";

// ------------------------------------------------------------------

type GameOverModalProps = {
	roomType: RoomType;
	status: "looser" | "winner";
};

export const GameOverModal: FC<GameOverModalProps> = ({ roomType, status }) => {
	const { onRoomCreateAsk } = useContext(AppContext);
	const { onModalClose } = useContext(CommonContext);
	const history = useHistory();
	const { t } = useTranslation();

	const onExit = useCallback(() => {
		history.push("/");
		onModalClose();
	}, [history, onModalClose]);

	return (
		<FormModal
			className="GameOverModal"
			onSubmit={() => onRoomCreateAsk(roomType)}
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
