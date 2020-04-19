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
	SeaBattleWeaponTypes
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const WeaponSelection = ({
	onSelectWeapon,
	weapons
}: {
	onSelectWeapon?: (weapon: SeaBattleWeaponData) => void;
	weapons: SeaBattleWeaponData[];
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

	const [selectionPos, setSelectionPosition] = useState<SeaBattlePosition>({
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
			if (
				!onSelectWeapon ||
				normalizedPosition.x < 0 ||
				normalizedPosition.x >= weapons.length
			) {
				return;
			}
			onSelectWeapon(weapons[normalizedPosition.x]);
		},
		[onSelectWeapon, weapons]
	);

	const onOver = useCallback((position: SeaBattlePosition) => {
		const normalizedPosition = getSVGNormalizedPosition(
			svg.current!,
			position
		);
		setSelectionPosition(normalizedPosition);
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
				position={selectionPos}
				visibility={selectionVisibility}
			/>
			<Cell
				type="cell-selected"
				position={selectedPosition}
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
						weapons.find(other => other.type === type)?.count === 0
							? "visible"
							: "hidden"
					}
				/>
			))}
		</svg>
	);
};
