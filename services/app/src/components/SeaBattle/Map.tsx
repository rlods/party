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

// ------------------------------------------------------------------

const getSVGPosition = (
	svg: SVGSVGElement,
	{ x, y }: SeaBattleAssetPosition
) => {
	var pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	pt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
	return { tx: pt.x, ty: pt.y };
};

// ------------------------------------------------------------------

// Order is important : Weapons under Boats under Hits
export const Map = ({
	player: { fleet, hits, weapons },
	selectedBoat,
	setSelectedBoat
}: {
	player: SeaBattlePlayerData;
	selectedBoat?: number;
	setSelectedBoat?: (index: number) => void;
}) => {
	const svg = useRef<SVGSVGElement>(null);
	const [activePos, setActiveCellPosition] = useState<SeaBattleAssetPosition>(
		{
			x: 0,
			y: 0
		}
	);
	const [activeVis, setActiveCellVisibility] = useState<
		SeaBattleAssetVisibility
	>("hidden");
	const [hoverPos, setHoverCellPosition] = useState<SeaBattleAssetPosition>({
		x: 0,
		y: 0
	});
	const [hoverVis, setHoverCellVisibility] = useState<
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

	const onLeave = useCallback(() => {
		setHoverCellVisibility("hidden");
	}, []);

	const onOver = useCallback((position: SeaBattleAssetPosition) => {
		const { tx, ty } = getSVGPosition(svg.current!, position);
		setHoverCellPosition({
			x: Math.floor(tx / GRID_CELL_UNIT_SIZE) * GRID_CELL_UNIT_SIZE,
			y: Math.floor(ty / GRID_CELL_UNIT_SIZE) * GRID_CELL_UNIT_SIZE
		});
		setHoverCellVisibility("visible");
	}, []);

	return (
		<svg
			width="100%"
			height="100%"
			viewBox="0 0 400 400"
			ref={svg}
			className="SeaBattleMap"
			onClick={e => onClick({ x: e.clientX, y: e.clientY })}
			onMouseLeave={onLeave}
			onMouseMove={e => onOver({ x: e.clientX, y: e.clientY })}>
			<BattleAssets />
			<rect width="400" height="400" fill="url(#grid)" />
			<Cell color="#555" position={activePos} visibility={activeVis} />
			<Cell color="#FF0" position={hoverPos} visibility={hoverVis} />
			<Weapons weapons={weapons} />
			<Fleet
				fleet={fleet}
				selectedBoat={selectedBoat}
				setSelectedBoat={setSelectedBoat}
			/>
			<Hits hits={hits} />
		</svg>
	);
};
