/*!
 * Color Thief v2.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright 2011, 2015 Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 */


/*
  CanvasImage Class
  Class that wraps the html image element and canvas.
  It also simplifies some of the canvas context manipulation
  with a set of helper functions.
*/

const MMCQ = require('./quantize')["MMCQ"];

class CanvasImage {
    constructor(image) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        document.body.appendChild(this.canvas);

        this.width = this.canvas.width = image.width;
        this.height = this.canvas.height = image.height;

        this.context.drawImage(image, 0, 0, this.width, this.height);
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    update(imageData) {
        this.context.putImageData(imageData, 0, 0);
    }
    getPixelCount() {
        return this.width * this.height;
    }
    getImageData() {
        return this.context.getImageData(0, 0, this.width, this.height);
    }
    removeCanvas() {
        this.canvas.parentNode.removeChild(this.canvas);
    }
}

class ColorThief {
    constructor() { }
    static getColorNoCanvas(pixels, imageWidth, imageHeight, quality, done) {
        this.getPaletteNoCanvas(pixels, imageWidth, imageHeight, 5, quality, function (palette) {
            done.apply(this, [palette[0]]);
        });
    }
    static getPaletteNoCanvas(pixels, imageWidth, imageHeight, colorCount, quality, done) {
        var pixelArray = [];
        var quality = 10;
        var pixelCount = imageHeight * imageWidth;

        for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
            offset = i * 4;
            r = pixels[offset + 0];
            g = pixels[offset + 1];
            b = pixels[offset + 2];
            a = pixels[offset + 3];
            // If pixel is mostly opaque and not white
            if (a >= 125) {
                if (!(r > 250 && g > 250 && b > 250)) {
                    pixelArray.push([r, g, b]);
                }
            }
        }

        var cmap = MMCQ.quantize(pixelArray, colorCount);
        var palette = cmap ? cmap.palette() : null;
        done.apply(this, [palette]);
    }
}

export default ColorThief;