import React, { useRef, useCallback, useState } from "react";
//
import { getSVGPosition } from "../../utils/svg";
import {
	SeaBattleAssetVisibility,
	SeaBattleAssetPosition,
	GRID_CELL_UNIT_SIZE,
	SeaBattleWeaponData
} from "../../utils/games/seabattle";
import { BattleAssets } from "./BattleAssets";
import { Cell } from "./Assets";
import { Weapons } from "./Weapons";

// ------------------------------------------------------------------

export const WeaponSelection = () => {
	const svg = useRef<SVGSVGElement>(null);

	const [selectedPosition, setSelectedPosition] = useState<
		SeaBattleAssetPosition
	>({
		x: 0,
		y: 0
	});
	const [selectedVisibility, setSelectedVisibility] = useState<
		SeaBattleAssetVisibility
	>("hidden");
	const [selectionPos, setSelectionPosition] = useState<
		SeaBattleAssetPosition
	>({
		x: 0,
		y: 0
	});
	const [selectionVisibility, setSelectionVisibility] = useState<
		SeaBattleAssetVisibility
	>("hidden");
	const onClick = useCallback((position: SeaBattleAssetPosition) => {
		const { tx, ty } = getSVGPosition(svg.current!, position);
		setSelectedPosition({
			x: Math.floor(tx / GRID_CELL_UNIT_SIZE),
			y: Math.floor(ty / GRID_CELL_UNIT_SIZE)
		});
		setSelectedVisibility("visible");
	}, []);

	const onOver = useCallback((position: SeaBattleAssetPosition) => {
		const { tx, ty } = getSVGPosition(svg.current!, position);
		setSelectionPosition({
			x: Math.floor(tx / GRID_CELL_UNIT_SIZE),
			y: Math.floor(ty / GRID_CELL_UNIT_SIZE)
		});
		setSelectionVisibility("visible");
	}, []);

	const onLeave = useCallback(() => {
		setSelectionVisibility("hidden");
	}, []);

	const weapons: SeaBattleWeaponData[] = [
		{ count: 1, position: { x: 0, y: 0 }, type: "bullet1" },
		{ count: 1, position: { x: 1, y: 0 }, type: "bullet2" },
		{ count: 1, position: { x: 2, y: 0 }, type: "bullet3" },
		{ count: 1, position: { x: 3, y: 0 }, type: "mine" }
	];

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
				position={selectionPos}
				visibility={selectionVisibility}
			/>
			<Cell
				type="cell-selected"
				position={selectedPosition}
				visibility={selectedVisibility}
			/>
			<Weapons weapons={weapons} />
			{weapons.map((weapon, index) => (
				<Cell
					key={index}
					type="cell-crossed"
					position={{ x: index, y: 0 }}
					visibility={weapon.count === 0 ? "visible" : "hidden"}
				/>
			))}
		</svg>
	);
};
