import React from "react";
//
import { OpponentSelection } from "./OpponentSelection";
import { WeaponSelection } from "./WeaponSelection";

// ------------------------------------------------------------------

export const OpponentControls = ({
	disabled = true,
	opponentsCount,
	opponentIndex,
	onSelectPreviousOpponent,
	onSelectNextOpponent
}: {
	disabled?: boolean;
	opponentsCount: number;
	opponentIndex: number;
	onSelectPreviousOpponent?: () => void;
	onSelectNextOpponent?: () => void;
}) => (
	<div className="SeaBattleControls">
		<OpponentSelection
			opponentsCount={opponentsCount}
			opponentIndex={opponentIndex}
			onSelectPreviousOpponent={onSelectPreviousOpponent}
			onSelectNextOpponent={onSelectNextOpponent}
		/>
		<WeaponSelection />
	</div>
);
