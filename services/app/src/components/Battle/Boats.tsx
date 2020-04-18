import React from "react";
import classNames from "classnames";
//
import { Asset } from "./Assets";
import {
	SeaBattleBoatData,
	SeabattleBoatOrientationMappings
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Boat = ({
	direction = "E",
	selected = false,
	type,
	status = "ok",
	...props
}: SeaBattleBoatData) => (
	<Asset
		className={classNames("Boat", status, { selected })}
		stopPropagation={true}
		type={SeabattleBoatOrientationMappings[type][direction]}
		{...props}
	/>
);
