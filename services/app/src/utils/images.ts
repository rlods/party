import * as jimp from "jimp";

// ------------------------------------------------------------------

export const getImageMainColor = async (url: string) => {
	const image = await jimp.read(url);
	const pixel = await image.resize(1, 1).getPixelColor(0, 0);
	const { r, g, b } = jimp.intToRGBA(pixel);
	return { r, g, b };
};
