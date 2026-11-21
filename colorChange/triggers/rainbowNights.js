import { rgbToColorString } from "../common.js";
import { changeColor } from "../colorChange.js";

const startRgb = {
    r: 255,
    g: 0,
    b: 0,
};

let currentRgb = null;

let intervalId = null;

const moveRainbow = (rgb) => {
    const newRgb = {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
    };

    if (rgb.r === 255 && rgb.g < 255 && rgb.b === 0) {
        newRgb.g += 5;
    } else if (rgb.r > 0 && rgb.g === 255 && rgb.b === 0) {
        newRgb.r -= 5;
    } else if (rgb.r === 0 && rgb.g === 255 && rgb.b < 255) {
        newRgb.b += 5;
    } else if (rgb.r === 0 && rgb.g > 0 && rgb.b === 255) {
        newRgb.g -= 5;
    } else if (rgb.r < 255 && rgb.g === 0 && rgb.b === 255) {
        newRgb.r += 5;
    } else if (rgb.r === 255 && rgb.g === 0 && rgb.b > 0) {
        newRgb.b -= 5;
    }

    return newRgb;
};

const startRainbow = () => {
    currentRgb = startRgb;

    intervalId = setInterval(() => {
        currentRgb = moveRainbow(currentRgb);
        const colorString = rgbToColorString(currentRgb);

        changeColor(colorString);
    }, 200);
};

const stopRainbow = () => {
    clearInterval(intervalId);
    intervalId = null;
};

export {
    startRainbow,
    stopRainbow,
};
