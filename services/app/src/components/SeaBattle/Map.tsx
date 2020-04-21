import React, { FC, useCallback, useRef, useState } from "react";
import { Cell } from "./Assets";
import { Weapons } from "./Weapons";
import { Hits } from "./Hits";
import { Fleet } from "./Fleet";
import { BattleAssets } from "./BattleAssets";
import { getSVGNormalizedPosition } from "../../utils/svg";
import {
	SeaBattlePosition,
	SeaBattleMapData,
	SeaBattleAssetVisibility
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

// Order is important : Weapons under Boats under Hits
export const Map: FC<{
	hideFleet: boolean;
	onCellClick?: (position: SeaBattlePosition) => void;
	map?: SeaBattleMapData;
	selectedBoatIndex?: number;
	onSelectBoatIndex?: (index: number) => void;
}> = ({
	hideFleet,
	onCellClick,
	map: { fleet, hits, opponentsWeapons } = {
		fleet: [],
		hits: [],
		opponentsWeapons: [],
		status: "ok",
		userId: "",
		weapons: {}
	},
	selectedBoatIndex,
	onSelectBoatIndex
}) => {
	const svg = useRef<SVGSVGElement>(null);

	const [selectedPos, setSelectedPos] = useState<SeaBattlePosition>({
		x: 0,
		y: 0
	});
	const [selectedVis, setSelectedVis] = useState<SeaBattleAssetVisibility>(
		"hidden"
	);

	const [selectionPos, setSelectionPos] = useState<SeaBattlePosition>({
		x: 0,
		y: 0
	});
	const [selectionVis, setSelectionVis] = useState<SeaBattleAssetVisibility>(
		"hidden"
	);

	const onClick = useCallback(
		(position: SeaBattlePosition) => {
			const normalizedPos = getSVGNormalizedPosition(
				svg.current!,
				position
			);
			if (
				selectedPos.x === normalizedPos.x &&
				selectedPos.y === normalizedPos.y
			) {
				// Reset
				setSelectedPos({ x: 0, y: 0 });
				setSelectedVis("hidden");
			} else {
				// Set
				setSelectedPos(normalizedPos);
				setSelectedVis("visible");
			}
			if (onCellClick) {
				onCellClick(normalizedPos);
			}
		},
		[onCellClick, selectedPos]
	);

	const onLeave = useCallback(() => {
		setSelectionVis("hidden");
	}, []);

	const onOver = useCallback((position: SeaBattlePosition) => {
		setSelectionPos(getSVGNormalizedPosition(svg.current!, position));
		setSelectionVis("visible");
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
				position={selectionPos}
				visibility={selectionVis}
			/>
			<Cell
				type="cell-selected"
				position={selectedPos}
				visibility={selectedVis}
			/>
			<Weapons weapons={opponentsWeapons} />
			<Fleet
				hideFleet={hideFleet}
				fleet={fleet}
				selectedBoatIndex={selectedBoatIndex}
				onSelectBoatIndex={onSelectBoatIndex}
			/>
			<Hits hits={hits} />
		</svg>
	);
};
