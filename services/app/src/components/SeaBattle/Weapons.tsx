import React from "react";
//
import { Asset } from "./Assets";
import { SeaBattleWeaponData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Weapon = ({ type, ...asset }: SeaBattleWeaponData) => (
	<Asset className="Weapon" type={type} data={asset} />
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
