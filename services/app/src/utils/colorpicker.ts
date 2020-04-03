import * as jimp from "jimp";

// ------------------------------------------------------------------

export type Color = {
  r: number;
  g: number;
  b: number;
};

export type CombinedColor = {
  bg: Color;
  fg: Color;
};

const CACHE: { [url: string]: CombinedColor } = {};

const DEFAULT_COLOR = {
  bg: { r: 255, g: 255, b: 255 },
  fg: { r: 0, g: 0, b: 0 }
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
        const bg = jimp.intToRGBA(pixel);
        CACHE[url] = res = {
          bg,
          fg:
            bg.r * 0.299 + bg.g * 0.587 + bg.b * 0.114 > 186
              ? { r: 0, g: 0, b: 0 }
              : { r: 255, g: 255, b: 255 }
        };
      } catch (err) {
        console.log("An error prevented colorpicking", err);
      }
    }
  }
  return res;
};

/*
const backgroundColor = color
? `rgb(${color.r}, ${color.g}, ${color.b})`
: void 0;
<div
style={{
  backgroundColor
}}
>
x
</div>

colors: {
  [id: string]: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
};,
colors: {}
const color = this.state.colors[album.id];

import { pickColor } from "../../utils/colorpicker";

private XXX = async (id: number, url: string) => {
  if (!this.state.colors[id]) {
    const color = await pickColor(url);
    this.setState({
      colors: { ...this.state.colors, [id]: color }
    });
  }
};
*/
