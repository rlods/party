import React from "react";
import classNames from "classnames";
//
import { Asset, AssetProps } from "./Assets";

// ------------------------------------------------------------------

export type HitType = "hitted1" | "hitted2" | "missed1" | "missed2";

export type HitProps = AssetProps & { type: HitType };

export const Hit = ({ type, ...props }: HitProps) => (
	<Asset className={classNames("Hit")} type={type} {...props} />
);

// ------------------------------------------------------------------

export const Hits = ({ hits }: { hits: HitProps[] }) => {
	return (
		<>
			{hits.map((hit, index) => (
				<Hit key={index} {...hit} />
			))}
		</>
	);
};
