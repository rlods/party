import axios from "axios";
//
import colorConfig from "../config/color";
import { sign } from "./sign";

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

const DEFAULT_COLOR: CombinedColor = {
	bg: { r: 255, g: 255, b: 255 },
	fg: "dark"
};

// ------------------------------------------------------------------

export const getMainColor = async (
	url: string
): Promise<{
	r: number;
	g: number;
	b: number;
}> => {
	url = Buffer.from(url).toString("base64");
	return (
		await axios.get(`${colorConfig.url}/main`, {
			params: {
				url,
				s: sign("/main", { url }, colorConfig.secret)
			}
		})
	).data;
};

// ------------------------------------------------------------------

// https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
export const pickColor = async (url: string) => {
	let res = DEFAULT_COLOR;
	if (url) {
		res = CACHE[url];
		if (!res) {
			try {
				const { r, g, b } = await getMainColor(url);
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
