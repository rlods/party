import React from "react";
//
import { Asset } from "./Assets";
import {
	SeaBattleWeaponData,
	WeaponsOffsetMappings,
	GRID_CELL_UNIT_SIZE
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Weapon = ({ type, ...asset }: SeaBattleWeaponData) => (
	<Asset
		className="Weapon"
		type={type}
		data={{
			...asset,
			position: {
				x:
					WeaponsOffsetMappings[type].x +
					asset.position.x * GRID_CELL_UNIT_SIZE,
				y:
					WeaponsOffsetMappings[type].y +
					asset.position.y * GRID_CELL_UNIT_SIZE
			}
		}}
	/>
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
