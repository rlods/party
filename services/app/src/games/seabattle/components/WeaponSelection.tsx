import React, { FC, useRef, useCallback, useState } from "react";
//
import { getSVGNormalizedPosition } from "../../../utils/svg";
import { BattleAssets } from "./BattleAssets";
import { Cell } from "./Assets";
import { Weapons } from "./Weapons";
import {
	SeaBattleAssetVisibility,
	SeaBattlePosition,
	SeaBattleWeaponTypes,
	SeaBattleWeaponType,
	GRID_CELL_UNIT_SIZE
} from "../utils";

// ------------------------------------------------------------------

export const WeaponSelection: FC<{
	onSelect?: (type: SeaBattleWeaponType) => void;
	weapons: { [type: string]: number };
	weaponType: SeaBattleWeaponType;
}> = ({ onSelect, weapons, weaponType }) => {
	const svg = useRef<SVGSVGElement>(null);

	const [selectedPos, setSelectedPos] = useState<number>(
		SeaBattleWeaponTypes.indexOf(weaponType)
	);
	const [selectedVis, setSelectedVis] = useState<SeaBattleAssetVisibility>(
		selectedPos >= 0 ? "visible" : "hidden"
	);

	const [selectionPos, setSelectionPos] = useState<number>(-1);
	const [selectionVis, setSelectionVis] = useState<SeaBattleAssetVisibility>(
		"hidden"
	);

	const onClick = useCallback(
		(position: SeaBattlePosition) => {
			const { x } = getSVGNormalizedPosition(
				svg.current!,
				position,
				GRID_CELL_UNIT_SIZE
			);
			if (selectedPos !== x && onSelect) {
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

	const onOver = useCallback(
		(position: SeaBattlePosition) => {
			if (onSelect) {
				setSelectionPos(
					getSVGNormalizedPosition(
						svg.current!,
						position,
						GRID_CELL_UNIT_SIZE
					).x
				);
				setSelectionVis("visible");
			}
		},
		[onSelect]
	);

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
					opponentId: "",
					position: { x: index, y: 0 },
					type
				}))}
			/>
			{SeaBattleWeaponTypes.map((type, index) => (
				<Cell
					key={index}
					type="cell-crossed"
					position={{ x: index, y: 0 }}
					visibility={!weapons[type] ? "visible" : "hidden"}
				/>
			))}
		</svg>
	);
};
