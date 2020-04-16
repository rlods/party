import * as jimp from "jimp";

// ------------------------------------------------------------------

export type Color = {
	r: number;
	g: number;
	b: number;
};

export type CombinedColor = {
	bg: Color;
	fg: string;
};

const CACHE: { [url: string]: CombinedColor } = {};

const DEFAULT_COLOR = {
	bg: { r: 255, g: 255, b: 255 },
	fg: "dark"
};

// ------------------------------------------------------------------

// https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
export const pickColor = async (url: string) => {
	let res = DEFAULT_COLOR;
	if (url) {
		res = CACHE[url];
		if (!res) {
			try {
				const image = await jimp.read(url);
				const pixel = await image.resize(1, 1).getPixelColor(0, 0);
				const { r, g, b } = jimp.intToRGBA(pixel);
				CACHE[url] = res = {
					bg: { r, g, b },
					fg:
						r * 0.299 + g * 0.587 + b * 0.114 > 186
							? "dark"
							: "light"
				};
			} catch (err) {
				console.error("An error prevented colorpicking", err);
				CACHE[url] = res = DEFAULT_COLOR;
			}
		}
	}
	return res;
};
