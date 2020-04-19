import React from "react";
import classNames from "classnames";
//
import { Asset } from "./Assets";
import {
	SeaBattleBoatData,
	GRID_CELL_UNIT_SIZE,
	BoatsOffsetMappings
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Boat = ({
	boat: { angle, type, status = "ok", ...asset },
	onClick,
	selected
}: {
	boat: SeaBattleBoatData;
	onClick?: () => void;
	selected: boolean;
}) => (
	<Asset
		className={classNames("SeaBattleBoat", status, {
			clickable: !!onClick,
			selected
		})}
		onClick={onClick}
		stopPropagation={true}
		data={{
			...asset,
			position: {
				x: 0,
				y: 0
			}
		}}
		transform={`translate(${
			BoatsOffsetMappings[type].x + asset.position.x * GRID_CELL_UNIT_SIZE
		}, ${
			BoatsOffsetMappings[type].y + asset.position.y * GRID_CELL_UNIT_SIZE
		}) rotate(${angle * 90}, 14, 14)`}
		type={type}
	/>
);
