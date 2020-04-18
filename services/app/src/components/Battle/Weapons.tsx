import React from "react";
import classNames from "classnames";
//
import { Asset, AssetProps } from "./Assets";

// ------------------------------------------------------------------

export type WeaponType = "bullet1" | "bullet2" | "bullet3" | "mine";

export type WeaponProps = AssetProps & { type: WeaponType };

export const Weapon = ({ type, ...props }: WeaponProps) => (
	<Asset className={classNames("Weapon")} type={type} {...props} />
);
// ------------------------------------------------------------------

export const Weapons = ({ weapons }: { weapons: WeaponProps[] }) => {
	return (
		<>
			{weapons.map((weapon, index) => (
				<Weapon key={index} {...weapon} />
			))}
		</>
	);
};
