import React from "react";
import classNames from "classnames";
import {
	SeaBattleAssetData,
	SeaBattleAssetType
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Asset = ({
	data: { color, position, rotate, visibility },
	className,
	onClick,
	stopPropagation = false,
	type
}: {
	className?: string;
	data: SeaBattleAssetData;
	onClick?: () => void;
	stopPropagation?: boolean;
	type: SeaBattleAssetType;
}) => (
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

export const Cell = (data: SeaBattleAssetData) => (
	<Asset type="cell-selection" data={data} />
);
