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
		data={asset}
		type={SeabattleBoatOrientationMappings[type][direction]}
	/>
);
