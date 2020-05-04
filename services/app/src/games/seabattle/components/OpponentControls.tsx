import React, { FC } from "react";
//
import { OpponentSelection } from "./OpponentSelection";
import { WeaponSelection } from "./WeaponSelection";
import { SeaBattleWeaponType } from "../utils";

// ------------------------------------------------------------------

export const SeaBattleOpponentControls: FC<{
	opponentsCount: number;
	opponentIndex: number;
	onSelectPreviousOpponent?: () => void;
	onSelectNextOpponent?: () => void;
	onSelectWeaponType: (type: SeaBattleWeaponType) => void;
	weapons: { [type: string]: number };
	weaponType: SeaBattleWeaponType;
}> = ({
	opponentsCount,
	opponentIndex,
	onSelectPreviousOpponent,
	onSelectNextOpponent,
	onSelectWeaponType,
	weapons,
	weaponType
}) => (
	<div className="SeaBattleOpponentControls SeaBattleControls">
		<OpponentSelection
			opponentsCount={opponentsCount}
			opponentIndex={opponentIndex}
			onSelectPreviousOpponent={onSelectPreviousOpponent}
			onSelectNextOpponent={onSelectNextOpponent}
		/>
		<WeaponSelection
			onSelect={onSelectWeaponType}
			weapons={weapons}
			weaponType={weaponType}
		/>
	</div>
);
