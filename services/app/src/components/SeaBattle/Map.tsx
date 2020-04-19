import React, { useCallback, useRef, useState } from "react";
import { Cell } from "./Assets";
import { Weapons } from "./Weapons";
import { Hits } from "./Hits";
import { Fleet } from "./Fleet";
import { BattleAssets } from "./BattleAssets";
import { getSVGNormalizedPosition } from "../../utils/svg";
import {
	SeaBattlePosition,
	SeaBattlePlayerData,
	SeaBattleAssetVisibility
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

// Order is important : Weapons under Boats under Hits
export const Map = ({
	hideActiveFleet = false,
	onCellClick,
	player: { fleet, hits, weapons } = { fleet: [], hits: [], weapons: [] },
	selectedBoatIndex,
	onSelectBoatIndex
}: {
	hideActiveFleet?: boolean;
	onCellClick?: (position: SeaBattlePosition) => void;
	player?: SeaBattlePlayerData;
	selectedBoatIndex?: number;
	onSelectBoatIndex?: (index: number) => void;
}) => {
	const svg = useRef<SVGSVGElement>(null);
	const [selectedPosition, setSelectedPosition] = useState<SeaBattlePosition>(
		{
			x: 0,
			y: 0
		}
	);
	const [selectedVisibility, setSelectedVisibility] = useState<
		SeaBattleAssetVisibility
	>("hidden");
	const [selectionPosition, setSelectionPosition] = useState<
		SeaBattlePosition
	>({
		x: 0,
		y: 0
	});
	const [selectionVisibility, setSelectionVisibility] = useState<
		SeaBattleAssetVisibility
	>("hidden");

	const onClick = useCallback(
		(position: SeaBattlePosition) => {
			const normalizedPosition = getSVGNormalizedPosition(
				svg.current!,
				position
			);
			setSelectedPosition(normalizedPosition);
			setSelectedVisibility("visible");
			if (onCellClick) {
				onCellClick(normalizedPosition);
			}
		},
		[onCellClick]
	);

	const onLeave = useCallback(() => {
		setSelectionVisibility("hidden");
	}, []);

	const onOver = useCallback((position: SeaBattlePosition) => {
		const normalizedPosition = getSVGNormalizedPosition(
			svg.current!,
			position
		);
		setSelectionPosition(normalizedPosition);
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
			<Fleet
				hideActiveFleet={hideActiveFleet}
				fleet={fleet}
				selectedBoatIndex={selectedBoatIndex}
				onSelectBoatIndex={onSelectBoatIndex}
			/>
			<Hits hits={hits} />
		</svg>
	);
};
