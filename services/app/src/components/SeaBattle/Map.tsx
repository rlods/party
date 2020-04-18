import React, { useCallback, useRef, useState } from "react";
import { Cell } from "./Assets";
import { Weapons } from "./Weapons";
import { Hits } from "./Hits";
import { Fleet } from "./Fleet";
import {
	SeaBattleAssetPosition,
	SeaBattlePlayerData,
	SeaBattleAssetVisibility
} from "../../utils/games/seabattle";

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
	data: { fleet, hits, weapons },
	position,
	selectedBoat,
	setSelectedBoat
}: {
	data: SeaBattlePlayerData;
	position: SeaBattleAssetPosition;
	selectedBoat: number;
	setSelectedBoat: (index: number) => void;
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
			x: Math.floor(tx / 40) * 40,
			y: Math.floor(ty / 40) * 40
		});
		setActiveCellVisibility("visible");
	}, []);

	const onLeave = useCallback(() => {
		setHoverCellVisibility("hidden");
	}, []);

	const onOver = useCallback((position: SeaBattleAssetPosition) => {
		const { tx, ty } = getSVGPosition(svg.current!, position);
		setHoverCellPosition({
			x: Math.floor(tx / 40) * 40,
			y: Math.floor(ty / 40) * 40
		});
		setHoverCellVisibility("visible");
	}, []);

	return (
		<svg
			width="400"
			height="400"
			ref={svg}
			className="Map"
			{...position}
			onClick={e => onClick({ x: e.clientX, y: e.clientY })}
			onMouseLeave={onLeave}
			onMouseMove={e => onOver({ x: e.clientX, y: e.clientY })}>
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
