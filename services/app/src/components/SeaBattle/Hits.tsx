import React from "react";
//
import { Asset } from "./Assets";
import {
	SeaBattleHitData,
	GRID_CELL_UNIT_SIZE,
	HitsOffsetMappings
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Hit = ({ type, ...asset }: SeaBattleHitData) => (
	<Asset
		className="SeaBattleHit"
		type={type}
		position={{
			x:
				HitsOffsetMappings[type].x +
				asset.position.x * GRID_CELL_UNIT_SIZE,
			y:
				HitsOffsetMappings[type].y +
				asset.position.y * GRID_CELL_UNIT_SIZE
		}}
	/>
);

// ------------------------------------------------------------------

export const Hits = ({ hits }: { hits: SeaBattleHitData[] }) => {
	return (
		<>
			{hits.map((hit, index) => (
				<Hit key={index} {...hit} />
			))}
		</>
	);
};
