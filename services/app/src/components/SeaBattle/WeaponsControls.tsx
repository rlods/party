import React, { useRef, useCallback, useState } from "react";
//
import { IconButton } from "../Common/IconButton";
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

export const WeaponControls = ({ disabled = true }: { disabled?: boolean }) => {
	const svg = useRef<SVGSVGElement>(null);
	const [selectedPosition, setActiveCellPosition] = useState<
		SeaBattleAssetPosition
	>({
		x: 0,
		y: 0
	});
	const [selectedVisibility, setActiveCellVisibility] = useState<
		SeaBattleAssetVisibility
	>("hidden");
	const [selectionPos, setHoverCellPosition] = useState<
		SeaBattleAssetPosition
	>({
		x: 0,
		y: 0
	});
	const [selectionVisibility, setHoverCellVisibility] = useState<
		SeaBattleAssetVisibility
	>("hidden");

	const onClick = useCallback((position: SeaBattleAssetPosition) => {
		const { tx, ty } = getSVGPosition(svg.current!, position);
		setActiveCellPosition({
			x: Math.floor(tx / GRID_CELL_UNIT_SIZE) * GRID_CELL_UNIT_SIZE,
			y: Math.floor(ty / GRID_CELL_UNIT_SIZE) * GRID_CELL_UNIT_SIZE
		});
		setActiveCellVisibility("visible");
	}, []);

	const onOver = useCallback((position: SeaBattleAssetPosition) => {
		const { tx, ty } = getSVGPosition(svg.current!, position);
		setHoverCellPosition({
			x: Math.floor(tx / GRID_CELL_UNIT_SIZE) * GRID_CELL_UNIT_SIZE,
			y: Math.floor(ty / GRID_CELL_UNIT_SIZE) * GRID_CELL_UNIT_SIZE
		});
		setHoverCellVisibility("visible");
	}, []);

	const onLeave = useCallback(() => {
		setHoverCellVisibility("hidden");
	}, []);

	const weapons: SeaBattleWeaponData[] = [
		{ position: { x: 0, y: 0 }, type: "bullet1" },
		{ position: { x: 1, y: 0 }, type: "bullet2" },
		{ position: { x: 2, y: 0 }, type: "bullet3" },
		{ position: { x: 3, y: 0 }, type: "mine" }
	];

	return (
		<div className="SeaBattleControls">
			<IconButton
				disabled={true}
				icon="caret-up"
				title="Previous enemy"
				onClick={() => {}}
			/>
			<svg
				className="SeaBattleWeaponControls"
				viewBox="0 0 160 40"
				ref={svg}
				onClick={e => onClick({ x: e.clientX, y: e.clientY })}
				onMouseLeave={onLeave}
				onMouseMove={e => onOver({ x: e.clientX, y: e.clientY })}>
				<BattleAssets />
				<rect width="160" height="40" fill="url(#grid)" />
				<Cell
					type="cell-selected"
					position={selectedPosition}
					visibility={selectedVisibility}
				/>
				<Cell
					type="cell-selection"
					position={selectionPos}
					visibility={selectionVisibility}
				/>
				<Weapons weapons={weapons} />
			</svg>
			<IconButton
				disabled={true}
				icon="caret-down"
				title="Next enemy"
				onClick={() => {}}
			/>
		</div>
	);
};
