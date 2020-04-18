import React from "react";
//
import { Asset } from "./Assets";
import { SeaBattleHitData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Hit = ({ type, ...asset }: SeaBattleHitData) => (
	<Asset className="Hit" type={type} data={asset} />
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
