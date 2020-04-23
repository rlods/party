import React, { FC } from "react";
import classNames from "classnames";
//
import { Asset } from "./Assets";
import {
	SeaBattleBoatData,
	GRID_CELL_UNIT_SIZE,
	BoatsOffsetMappings,
	HitsOffsetInBoatMappings
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Boat: FC<{
	boat: SeaBattleBoatData;
	hideFleet: boolean;
	onClick?: () => void;
	selected: boolean;
}> = ({
	boat: { angle, hits, type, status = "ok", ...asset },
	hideFleet,
	onClick,
	selected
}) => (
	<g
		className="SeaBattleBoatAnim"
		transform={`translate(${
			BoatsOffsetMappings[type].x + asset.position.x * GRID_CELL_UNIT_SIZE
		}, ${
			BoatsOffsetMappings[type].y + asset.position.y * GRID_CELL_UNIT_SIZE
		}) rotate(${angle * 90}, 14, 14)`}>
		{!hideFleet || status === "ko" ? (
			<Asset
				className={classNames("SeaBattleBoat", status, {
					clickable: !!onClick,
					selected
				})}
				onClick={onClick}
				stopPropagation={true}
				position={{
					x: 0,
					y: 0
				}}
				type={type}
			/>
		) : null}
		{hits.map((hit, index) => (
			<Asset
				key={index}
				className="SeaBattleHit"
				type={hit.type}
				position={{
					x:
						HitsOffsetInBoatMappings[hit.type].x +
						hit.position.x * GRID_CELL_UNIT_SIZE,
					y:
						HitsOffsetInBoatMappings[hit.type].y +
						hit.position.y * GRID_CELL_UNIT_SIZE
				}}
			/>
		))}
	</g>
);
