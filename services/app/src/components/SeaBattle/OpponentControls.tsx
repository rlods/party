import React from "react";
//
import { OpponentSelection } from "./OpponentSelection";
import { WeaponSelection } from "./WeaponSelection";

// ------------------------------------------------------------------

export const OpponentControls = ({
	disabled = true,
	opponentsCount,
	onSelectPreviousOpponent,
	onSelectNextOpponent
}: {
	disabled?: boolean;
	opponentsCount: number;
	onSelectPreviousOpponent?: () => void;
	onSelectNextOpponent?: () => void;
}) => (
	<div className="SeaBattleControls">
		{opponentsCount > 1 ? (
			<OpponentSelection
				onSelectPreviousOpponent={onSelectPreviousOpponent}
				onSelectNextOpponent={onSelectNextOpponent}
			/>
		) : null}
		<WeaponSelection />
	</div>
);
