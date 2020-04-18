import React, { useCallback, useRef, useState } from "react";
import { Visibility, Position, Cell } from "./Assets";
import { Weapons, WeaponProps } from "./Weapons";
import { Hits, HitProps } from "./Hits";
import { Fleet } from "./Fleet";
import { BoatProps } from "./Boats";

// ------------------------------------------------------------------

const getSVGPosition = (svg: SVGSVGElement, { x, y }: Position) => {
	var pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	pt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
	return { tx: pt.x, ty: pt.y };
};

// ------------------------------------------------------------------

export type MapData = {
	fleet: BoatProps[];
	hits: HitProps[];
	weapons: WeaponProps[];
};

export const Map = ({
	data: { fleet, hits, weapons },
	position,
	selectedBoat,
	setSelectedBoat
}: {
	data: MapData;
	position: Position;
	selectedBoat: number;
	setSelectedBoat: (index: number) => void;
}) => {
	const svg = useRef<SVGSVGElement>(null);
	const [activePos, setActivePos] = useState<Position>({ x: 0, y: 0 });
	const [activeVis, setActiveVis] = useState<Visibility>("hidden");
	const [hoverPos, setHoverPos] = useState<Position>({ x: 0, y: 0 });
	const [hoverVis, setHoverVis] = useState<Visibility>("hidden");

	const onClick = useCallback((position: Position) => {
		const { tx, ty } = getSVGPosition(svg.current!, position);
		setActivePos({
			x: Math.floor(tx / 40) * 40,
			y: Math.floor(ty / 40) * 40
		});
		setActiveVis("visible");
	}, []);

	const onLeave = useCallback(() => {
		// setActiveVis("hidden");
		setHoverVis("hidden");
	}, []);

	const onOver = useCallback((position: Position) => {
		const { tx, ty } = getSVGPosition(svg.current!, position);
		setHoverPos({
			x: Math.floor(tx / 40) * 40,
			y: Math.floor(ty / 40) * 40
		});
		setHoverVis("visible");
	}, []);

	return (
		<svg
			ref={svg}
			className="Map"
			{...position}
			onClick={e => onClick({ x: e.clientX, y: e.clientY })}
			onMouseLeave={onLeave}
			onMouseMove={e => onOver({ x: e.clientX, y: e.clientY })}>
			<g>
				<rect width="400" height="400" fill="url(#grid)" />
				<Cell
					color="#555"
					position={activePos}
					visibility={activeVis}
				/>
				<Cell color="#FF0" position={hoverPos} visibility={hoverVis} />
			</g>
			<Fleet
				fleet={fleet}
				selectedBoat={selectedBoat}
				setSelectedBoat={setSelectedBoat}
			/>
			<Hits hits={hits} />
			<Weapons weapons={weapons} />
		</svg>
	);
};
