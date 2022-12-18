import ColorThief from "./color-thief2";
import { rgbToHex, pSBC } from "./util";

function post(rgb) {
    let imageHex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    let buttonHex = pSBC(-0.4, imageHex);
    let fontHex = (rgb[0]*0.299 + rgb[1]*0.587 + rgb[2]*0.114) > 186
        ? "#000000" : "#ffffff";
    let thumbHex = pSBC(0.5, buttonHex, fontHex, true);
    self.postMessage({rgb, imageHex, buttonHex, fontHex, thumbHex});
}

self.onmessage = ({data: {pixels, width, height}}) => {
    ColorThief.getColorNoCanvas(new Uint8Array(pixels), width, height, 10, post);
};