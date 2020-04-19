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
