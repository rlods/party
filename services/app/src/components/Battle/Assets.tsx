import React from "react";
import classNames from "classnames";
//
import { OrientedBoatType } from "./Boats";
import { HitType } from "./Hits";
import { WeaponType } from "./Weapons";

// ------------------------------------------------------------------

export type Position = { x: number; y: number };

export type Visibility = "hidden" | "visible";

export type AssetType =
	| OrientedBoatType
	| HitType
	| WeaponType
	| "cell-selection";

export type AssetProps = {
	className?: string;
	color?: string;
	onClick?: () => void;
	position: Position;
	rotate?: string;
	stopPropagation?: boolean;
	visibility?: Visibility;
};

export const Asset = ({
	className,
	color,
	onClick,
	position,
	rotate,
	stopPropagation = false,
	type,
	visibility
}: AssetProps & { type: AssetType }) => (
	<use
		onClick={e => {
			if (stopPropagation) {
				e.stopPropagation();
			}
			if (onClick) {
				onClick();
			}
		}}
		className={classNames(className, type)}
		href={`#${type}`}
		{...position}
		rotate={rotate}
		fill={color}
		visibility={visibility}
	/>
);

// ------------------------------------------------------------------

export const Cell = (props: AssetProps) => (
	<Asset type="cell-selection" {...props} />
);
