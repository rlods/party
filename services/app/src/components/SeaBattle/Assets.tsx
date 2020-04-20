import React from "react";
import {
	SeaBattleAssetType,
	SeaBattleCellData,
	GRID_CELL_UNIT_SIZE,
	SeaBattlePosition
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Asset = ({
	className,
	onClick,
	position,
	stopPropagation = false,
	transform,
	type,
	visibility
}: {
	className?: string;
	onClick?: () => void;
	position: SeaBattlePosition;
	stopPropagation?: boolean;
	transform?: string;
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
		transform={transform}
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
		position={{
			x: asset.position.x * GRID_CELL_UNIT_SIZE,
			y: asset.position.y * GRID_CELL_UNIT_SIZE
		}}
	/>
);
