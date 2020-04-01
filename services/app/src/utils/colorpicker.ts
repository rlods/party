import * as jimp from "jimp";

// ------------------------------------------------------------------

export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const CACHE: { [url: string]: RGBA } = {};

// ------------------------------------------------------------------

export const pickColor = async (url: string) => {
  let value = CACHE[url];
  if (!value) {
    const image = await jimp.read(url);
    const pixel = await image.resize(1, 1).getPixelColor(0, 0);
    CACHE[url] = value = jimp.intToRGBA(pixel);
  }
  return value;
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
