import ColorThief from "./color-thief2";
import { rgbToHex } from "./util";

self.onmessage = ({data: {url}}) => {
    ColorThief.getColorNoCanvas(url, 400, 400, 1, rgb => {
        self.postMessage({rgb, hex: rgbToHex(rgb[0], rgb[1], rgb[2])});
    });
};