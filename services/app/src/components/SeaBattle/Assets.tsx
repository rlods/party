import React from "react";
import {
	SeaBattleAssetData,
	SeaBattleAssetType,
	SeaBattleCellData
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
		className={className}
		href={`#${type}`}
		rotate={rotate}
		fill={color}
		visibility={visibility}
		{...position}
	/>
);

// ------------------------------------------------------------------

export const Cell = ({ type, ...asset }: SeaBattleCellData) => (
	<Asset className="SeaBattleCell" type={type} data={asset} />
);
