import React from "react";
//
import { IconButton } from "../Common/IconButton";
import { useTranslation } from "react-i18next";

// ------------------------------------------------------------------

export const OpponentSelection = ({
	opponentsCount,
	opponentIndex,
	onSelectPreviousOpponent,
	onSelectNextOpponent
}: {
	opponentsCount: number;
	opponentIndex: number;
	onSelectPreviousOpponent?: () => void;
	onSelectNextOpponent?: () => void;
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
			<span className="SeaBattleOpponentSelectionLabel">No opponent</span>
		</div>
	);
};
