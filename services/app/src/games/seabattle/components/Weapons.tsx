import React, { FC } from "react";
//
import { Asset } from "./Assets";
import {
	SeaBattleWeaponData,
	SeaBattleWeaponsOffsetMappings,
	GRID_CELL_UNIT_SIZE
} from "../utils";

// ------------------------------------------------------------------

export const Weapon: FC<SeaBattleWeaponData> = ({ type, ...asset }) => (
	<Asset
		className="SeaBattleWeapon"
		type={type}
		position={{
			x:
				SeaBattleWeaponsOffsetMappings[type].x +
				asset.position.x * GRID_CELL_UNIT_SIZE,
			y:
				SeaBattleWeaponsOffsetMappings[type].y +
				asset.position.y * GRID_CELL_UNIT_SIZE
		}}
	/>
);
// ------------------------------------------------------------------

export const Weapons = ({
	weapons
}: {
	weapons: ReadonlyArray<SeaBattleWeaponData>;
}) => {
	return (
		<>
			{weapons.map((weapon, index) => (
				<Weapon key={index} {...weapon} />
			))}
		</>
	);
};
