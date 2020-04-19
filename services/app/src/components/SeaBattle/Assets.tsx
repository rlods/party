import React from "react";
import {
	SeaBattleAssetData,
	SeaBattleAssetType,
	SeaBattleCellData,
	GRID_CELL_UNIT_SIZE
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Asset = ({
	data: { position },
	className,
	onClick,
	stopPropagation = false,
	type,
	visibility
}: {
	className?: string;
	data: SeaBattleAssetData;
	onClick?: () => void;
	stopPropagation?: boolean;
	type: SeaBattleAssetType;
	visibility?: string;
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
		visibility={visibility}
		{...position}
	/>
);

// ------------------------------------------------------------------

export const Cell = ({ type, visibility, ...asset }: SeaBattleCellData) => (
	<Asset
		className="SeaBattleCell"
		type={type}
		visibility={visibility}
		data={{
			...asset,
			position: {
				x: asset.position.x * GRID_CELL_UNIT_SIZE,
				y: asset.position.y * GRID_CELL_UNIT_SIZE
			}
		}}
	/>
);
