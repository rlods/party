import React from "react";
import classNames from "classnames";
//
import { AssetProps, Asset } from "./Assets";

// ------------------------------------------------------------------

export type BoatDirection = "N" | "E" | "S" | "W";

export type BoatStatus = "ok" | "ko";

export type BoatType = "boat1" | "boat2" | "boat3";

export type OrientedBoatType =
	| "boat1-N"
	| "boat1-E"
	| "boat1-S"
	| "boat1-W"
	| "boat2-N"
	| "boat2-E"
	| "boat2-S"
	| "boat2-W"
	| "boat3-N"
	| "boat3-E"
	| "boat3-S"
	| "boat3-W";

export type BoatProps = AssetProps & {
	direction?: BoatDirection;
	selected?: boolean;
	status: BoatStatus;
	type: BoatType;
};

export const OrientedBoatTypeMapping: {
	[type: string]: { [direction: string]: OrientedBoatType };
} = {
	boat1: {
		N: "boat1-N",
		E: "boat1-E",
		S: "boat1-S",
		W: "boat1-W"
	},
	boat2: {
		N: "boat2-N",
		E: "boat2-E",
		S: "boat2-S",
		W: "boat2-W"
	},
	boat3: {
		N: "boat3-N",
		E: "boat3-E",
		S: "boat3-S",
		W: "boat3-W"
	}
};

export const Boat = ({
	direction = "E",
	selected = false,
	type,
	status = "ok",
	...props
}: BoatProps) => (
	<Asset
		className={classNames("Boat", status, { selected })}
		stopPropagation={true}
		type={OrientedBoatTypeMapping[type][direction]}
		{...props}
	/>
);
