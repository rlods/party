import React from "react";
import classNames from "classnames";
//
import { Asset } from "./Assets";
import {
	SeaBattleBoatData,
	SeabattleBoatOrientationMappings,
	GRID_CELL_UNIT_SIZE
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Boat = ({
	boat: { direction = "E", type, status = "ok", ...asset },
	onClick,
	selected
}: {
	boat: SeaBattleBoatData;
	onClick: () => void;
	selected: boolean;
}) => (
	<Asset
		className={classNames("Boat", status, { selected })}
		onClick={onClick}
		stopPropagation={true}
		data={{
			...asset,
			position: {
				x: 6 + asset.position.x * GRID_CELL_UNIT_SIZE,
				y: 6 + asset.position.y * GRID_CELL_UNIT_SIZE
			}
		}}
		type={SeabattleBoatOrientationMappings[type][direction]}
	/>
);
