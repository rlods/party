import { SeaBattlePosition, GRID_CELL_UNIT_SIZE } from "./games/seabattle";

export const getSVGPosition = (
	svg: SVGSVGElement,
	{ x, y }: { x: number; y: number }
) => {
	var pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	pt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
	return { tx: pt.x, ty: pt.y };
};

export const getSVGNormalizedPosition = (
	svg: SVGSVGElement,
	position: SeaBattlePosition
): SeaBattlePosition => {
	const { tx, ty } = getSVGPosition(svg, position);
	return {
		x: Math.floor(tx / GRID_CELL_UNIT_SIZE),
		y: Math.floor(ty / GRID_CELL_UNIT_SIZE)
	};
};
