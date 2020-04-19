import React from "react";
//
import { OpponentSelection } from "./OpponentSelection";
import { WeaponSelection } from "./WeaponSelection";
import { SeaBattleWeaponType } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const OpponentControls = ({
	opponentsCount,
	opponentIndex,
	onSelectPreviousOpponent,
	onSelectNextOpponent,
	onSelectWeaponType,
	weapons
}: {
	opponentsCount: number;
	opponentIndex: number;
	onSelectPreviousOpponent?: () => void;
	onSelectNextOpponent?: () => void;
	onSelectWeaponType: (type?: SeaBattleWeaponType) => void;
	weapons: { [type: string]: number };
}) => (
	<div className="SeaBattleControls">
		<OpponentSelection
			opponentsCount={opponentsCount}
			opponentIndex={opponentIndex}
			onSelectPreviousOpponent={onSelectPreviousOpponent}
			onSelectNextOpponent={onSelectNextOpponent}
		/>
		<WeaponSelection onSelect={onSelectWeaponType} weapons={weapons} />
	</div>
);
