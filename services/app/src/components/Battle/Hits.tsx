import React from "react";
import classNames from "classnames";
//
import { Asset } from "./Assets";
import { SeaBattleHitData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Hit = ({ type, ...props }: SeaBattleHitData) => (
	<Asset className={classNames("Hit")} type={type} {...props} />
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
