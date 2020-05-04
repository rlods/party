type Position = { x: number; y: number };

// ------------------------------------------------------------------

export const getSVGPosition = (
	svg: SVGSVGElement,
	{ x, y }: Position
): Position => {
	const pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	return pt.matrixTransform(svg.getScreenCTM()!.inverse());
};

export const getSVGNormalizedPosition = (
	svg: SVGSVGElement,
	position: Position,
	unitSize: number
): Position => {
	const { x, y } = getSVGPosition(svg, position);
	return {
		x: Math.floor(x / unitSize),
		y: Math.floor(y / unitSize)
	};
};
