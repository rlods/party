import React from "react";
import classNames from "classnames";
import {
	SeaBattleAssetData,
	SeaBattleAssetType
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Asset = ({
	className,
	color,
	onClick,
	position,
	rotate,
	stopPropagation = false,
	type,
	visibility
}: SeaBattleAssetData & { type: SeaBattleAssetType }) => (
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

export const Cell = (props: SeaBattleAssetData) => (
	<Asset type="cell-selection" {...props} />
);
