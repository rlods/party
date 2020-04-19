import React from "react";
import classNames from "classnames";
//
import { Asset } from "./Assets";
import {
	SeaBattleBoatData,
	GRID_CELL_UNIT_SIZE,
	BoatsOffsetMappings
} from "../../utils/games/seabattle";
import { SeabattleBoatOrientationMappings } from "../../utils/games/seabattle/mappings";

// ------------------------------------------------------------------

export const Boat = ({
	boat: { direction = "E", type, status = "ok", ...asset },
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
				x:
					BoatsOffsetMappings[type].x +
					asset.position.x * GRID_CELL_UNIT_SIZE,
				y:
					BoatsOffsetMappings[type].y +
					asset.position.y * GRID_CELL_UNIT_SIZE
			}
		}}
		type={SeabattleBoatOrientationMappings[type][direction]}
	/>
);
