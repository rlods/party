import React, { useRef, useCallback, useState } from "react";
//
import { getSVGNormalizedPosition } from "../../utils/svg";
import { BattleAssets } from "./BattleAssets";
import { Cell } from "./Assets";
import { Weapons } from "./Weapons";
import {
	SeaBattleAssetVisibility,
	SeaBattlePosition,
	SeaBattleWeaponData,
	SeaBattleWeaponTypes,
	SeaBattleWeaponType,
	countWeapons
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const WeaponSelection = ({
	onSelect,
	weapons
}: {
	onSelect: (type?: SeaBattleWeaponType) => void;
	weapons: SeaBattleWeaponData[];
}) => {
	const svg = useRef<SVGSVGElement>(null);

	const [selectedPos, setSelectedPos] = useState<number>(-1);
	const [selectedVis, setSelectedVis] = useState<SeaBattleAssetVisibility>(
		"hidden"
	);

	const [selectionPos, setSelectionPos] = useState<number>(-1);
	const [selectionVis, setSelectionVis] = useState<SeaBattleAssetVisibility>(
		"hidden"
	);

	const onClick = useCallback(
		(position: SeaBattlePosition) => {
			const { x } = getSVGNormalizedPosition(svg.current!, position);
			if (selectedPos === x) {
				// Reset
				setSelectedPos(-1);
				setSelectedVis("hidden");
				onSelect(void 0);
			} else {
				// Set
				setSelectedPos(x);
				setSelectedVis("visible");
				onSelect(SeaBattleWeaponTypes[x]);
			}
		},
		[onSelect, selectedPos]
	);

	const onLeave = useCallback(() => {
		setSelectionVis("hidden");
	}, []);

	const onOver = useCallback((position: SeaBattlePosition) => {
		setSelectionPos(getSVGNormalizedPosition(svg.current!, position).x);
		setSelectionVis("visible");
	}, []);

	return (
		<svg
			className="SeaBattleWeaponSelection"
			viewBox="0 0 160 40"
			ref={svg}
			onClick={e => onClick({ x: e.clientX, y: e.clientY })}
			onMouseLeave={onLeave}
			onMouseMove={e => onOver({ x: e.clientX, y: e.clientY })}>
			<BattleAssets />
			<rect width="400" height="400" fill="url(#sea-grid)" />
			<Cell
				type="cell-selection"
				position={{ x: selectionPos, y: 0 }}
				visibility={selectionVis}
			/>
			<Cell
				type="cell-selected"
				position={{ x: selectedPos, y: 0 }}
				visibility={selectedVis}
			/>
			<Weapons
				weapons={SeaBattleWeaponTypes.map((type, index) => ({
					count: 1,
					position: { x: index, y: 0 },
					type
				}))}
			/>
			{SeaBattleWeaponTypes.map((type, index) => (
				<Cell
					key={index}
					type="cell-crossed"
					position={{ x: index, y: 0 }}
					visibility={
						countWeapons(weapons, type) === 0 ? "visible" : "hidden"
					}
				/>
			))}
		</svg>
	);
};
