import ColorThief from "./color-thief2";
import { rgbToHex, pSBC } from "./util";

self.onmessage = ({data: {url}}) => {
    ColorThief.getColorNoCanvas(url, 400, 400, 1, rgb => {
        let hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        self.postMessage({rgb, hex, buttonHex: pSBC (-0.4, hex)});
    });
};