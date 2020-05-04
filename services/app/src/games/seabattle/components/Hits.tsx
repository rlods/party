import React, { FC } from "react";
//
import { Asset } from "./Assets";
import {
	SeaBattleHitData,
	GRID_CELL_UNIT_SIZE,
	HitsOffsetInCellMappings
} from "../utils";

// ------------------------------------------------------------------

export const Hit: FC<SeaBattleHitData> = ({ type, ...asset }) => (
	<Asset
		className="SeaBattleHit"
		type={type}
		position={{
			x:
				HitsOffsetInCellMappings[type].x +
				asset.position.x * GRID_CELL_UNIT_SIZE,
			y:
				HitsOffsetInCellMappings[type].y +
				asset.position.y * GRID_CELL_UNIT_SIZE
		}}
	/>
);

// ------------------------------------------------------------------

export const Hits: FC<{ hits: SeaBattleHitData[] }> = ({ hits }) => {
	return (
		<>
			{hits.map((hit, index) => (
				<Hit key={index} {...hit} />
			))}
		</>
	);
};
