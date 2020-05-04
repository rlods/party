import React, { FC } from "react";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../../../components/Common/IconButton";

// ------------------------------------------------------------------

export const OpponentSelection: FC<{
	opponentsCount: number;
	opponentIndex: number;
	onSelectPreviousOpponent?: () => void;
	onSelectNextOpponent?: () => void;
}> = ({
	opponentsCount,
	opponentIndex,
	onSelectPreviousOpponent,
	onSelectNextOpponent
}) => {
	const { t } = useTranslation();

	return opponentsCount > 0 ? (
		<div className="SeaBattleOpponentSelection">
			<IconButton
				disabled={opponentsCount <= 1}
				icon="caret-left"
				title="Previous enemy"
				onClick={onSelectPreviousOpponent}
			/>
			<span className="SeaBattleOpponentSelectionLabel">
				{t("games.seabattle.opponent_index", {
					index: `${opponentIndex + 1} / ${opponentsCount}`
				})}
			</span>
			<IconButton
				disabled={opponentsCount <= 1}
				icon="caret-right"
				title="Next enemy"
				onClick={onSelectNextOpponent}
			/>
		</div>
	) : (
		<div className="SeaBattleOpponentSelection">
			<span className="SeaBattleOpponentSelectionLabel">
				{t("games.no_opponents")}
			</span>
		</div>
	);
};
