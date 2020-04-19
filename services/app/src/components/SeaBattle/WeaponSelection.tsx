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
	onSelectWeaponType,
	weapons
}: {
	onSelectWeaponType: (type?: SeaBattleWeaponType) => void;
	weapons: SeaBattleWeaponData[];
}) => {
	const svg = useRef<SVGSVGElement>(null);

	const [selectedPosition, setSelectedPosition] = useState<number>(-1);
	const [selectedVisibility, setSelectedVisibility] = useState<
		SeaBattleAssetVisibility
	>("hidden");

	const [selectionPosition, setSelectionPosition] = useState<number>(-1);
	const [selectionVisibility, setSelectionVisibility] = useState<
		SeaBattleAssetVisibility
	>("hidden");

	const onClick = useCallback(
		(position: SeaBattlePosition) => {
			const { x } = getSVGNormalizedPosition(svg.current!, position);
			if (selectedPosition === x) {
				// Reset
				setSelectedPosition(-1);
				setSelectedVisibility("hidden");
				onSelectWeaponType(void 0);
				return;
			}
			// Set
			setSelectedPosition(x);
			setSelectedVisibility("visible");
			onSelectWeaponType(SeaBattleWeaponTypes[x]);
		},
		[onSelectWeaponType, selectedPosition]
	);

	const onOver = useCallback((position: SeaBattlePosition) => {
		const { x } = getSVGNormalizedPosition(svg.current!, position);
		setSelectionPosition(x);
		setSelectionVisibility("visible");
	}, []);

	const onLeave = useCallback(() => {
		setSelectionVisibility("hidden");
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
				position={{ x: selectionPosition, y: 0 }}
				visibility={selectionVisibility}
			/>
			<Cell
				type="cell-selected"
				position={{ x: selectedPosition, y: 0 }}
				visibility={selectedVisibility}
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
