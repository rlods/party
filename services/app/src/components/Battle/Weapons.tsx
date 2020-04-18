import React from "react";
import classNames from "classnames";
//
import { Asset } from "./Assets";
import { SeaBattleWeaponData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Weapon = ({ type, ...props }: SeaBattleWeaponData) => (
	<Asset className={classNames("Weapon")} type={type} {...props} />
);
// ------------------------------------------------------------------

export const Weapons = ({ weapons }: { weapons: SeaBattleWeaponData[] }) => {
	return (
		<>
			{weapons.map((weapon, index) => (
				<Weapon key={index} {...weapon} />
			))}
		</>
	);
};
