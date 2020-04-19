import React, { useCallback, useRef, useState } from "react";
import { Cell } from "./Assets";
import { Weapons } from "./Weapons";
import { Hits } from "./Hits";
import { Fleet } from "./Fleet";
import {
	SeaBattleAssetPosition,
	SeaBattlePlayerData,
	SeaBattleAssetVisibility,
	GRID_CELL_UNIT_SIZE
} from "../../utils/games/seabattle";
import { BattleAssets } from "./BattleAssets";
import { getSVGPosition } from "../../utils/svg";

// ------------------------------------------------------------------

// Order is important : Weapons under Boats under Hits
export const Map = ({
	hideFleet = false,
	player: { fleet, hits, weapons },
	selectedBoat,
	setSelectedBoat
}: {
	hideFleet?: boolean;
	player: SeaBattlePlayerData;
	selectedBoat?: number;
	setSelectedBoat?: (index: number) => void;
}) => {
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
	const [selectionPosition, setSelectionPosition] = useState<
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
			x: Math.floor(tx / GRID_CELL_UNIT_SIZE) * GRID_CELL_UNIT_SIZE,
			y: Math.floor(ty / GRID_CELL_UNIT_SIZE) * GRID_CELL_UNIT_SIZE
		});
		setSelectedVisibility("visible");
	}, []);

	const onLeave = useCallback(() => {
		setSelectionVisibility("hidden");
	}, []);

	const onOver = useCallback((position: SeaBattleAssetPosition) => {
		const { tx, ty } = getSVGPosition(svg.current!, position);
		setSelectionPosition({
			x: Math.floor(tx / GRID_CELL_UNIT_SIZE) * GRID_CELL_UNIT_SIZE,
			y: Math.floor(ty / GRID_CELL_UNIT_SIZE) * GRID_CELL_UNIT_SIZE
		});
		setSelectionVisibility("visible");
	}, []);

	return (
		<svg
			className="SeaBattleMap"
			viewBox="0 0 400 400"
			ref={svg}
			onClick={e => onClick({ x: e.clientX, y: e.clientY })}
			onMouseLeave={onLeave}
			onMouseMove={e => onOver({ x: e.clientX, y: e.clientY })}>
			<BattleAssets />
			<rect width="400" height="400" fill="url(#sea-grid)" />
			<Cell
				type="cell-selection"
				position={selectionPosition}
				visibility={selectionVisibility}
			/>
			<Cell
				type="cell-selected"
				position={selectedPosition}
				visibility={selectedVisibility}
			/>
			<Weapons weapons={weapons} />
			{!hideFleet ? (
				<Fleet
					fleet={fleet}
					selectedBoat={selectedBoat}
					setSelectedBoat={setSelectedBoat}
				/>
			) : null}
			<Hits hits={hits} />
		</svg>
	);
};
