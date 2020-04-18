import React from "react";
//
import { Asset } from "./Assets";
import {
	SeaBattleHitData,
	GRID_CELL_UNIT_SIZE
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Hit = ({ type, ...asset }: SeaBattleHitData) => (
	<Asset
		className="Hit"
		type={type}
		data={{
			...asset,
			position: {
				x: 10 + asset.position.x * GRID_CELL_UNIT_SIZE,
				y: 10 + asset.position.y * GRID_CELL_UNIT_SIZE
			}
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
