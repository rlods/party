import React from "react";
//
import { OpponentSelection } from "./OpponentSelection";
import { WeaponSelection } from "./WeaponSelection";
import { SeaBattleWeaponData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const OpponentControls = ({
	disabled = true,
	opponentsCount,
	opponentIndex,
	onSelectPreviousOpponent,
	onSelectNextOpponent,
	onSelectWeapon,
	weapons
}: {
	disabled?: boolean;
	opponentsCount: number;
	opponentIndex: number;
	onSelectPreviousOpponent?: () => void;
	onSelectNextOpponent?: () => void;
	onSelectWeapon?: (weapon: SeaBattleWeaponData) => void;
	weapons: SeaBattleWeaponData[];
}) => (
	<div className="SeaBattleControls">
		<OpponentSelection
			opponentsCount={opponentsCount}
			opponentIndex={opponentIndex}
			onSelectPreviousOpponent={onSelectPreviousOpponent}
			onSelectNextOpponent={onSelectNextOpponent}
		/>
		<WeaponSelection onSelectWeapon={onSelectWeapon} weapons={weapons} />
	</div>
);
