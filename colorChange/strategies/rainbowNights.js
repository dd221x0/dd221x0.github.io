import { convertColorToString, inverseColor } from "../common.js";

const startColor = {
    r: 255,
    g: 0,
    b: 0,
};

let currentColor = null;

let intervalId = null;

const moveRainbow = (color) => {
    const newColor = {
        r: color.r,
        g: color.g,
        b: color.b,
    };

    if (color.r === 255 && color.g < 255 && color.b === 0) {
        newColor.g += 5;
    } else if (color.r > 0 && color.g === 255 && color.b === 0) {
        newColor.r -= 5;
    } else if (color.r === 0 && color.g === 255 && color.b < 255) {
        newColor.b += 5;
    } else if (color.r === 0 && color.g > 0 && color.b === 255) {
        newColor.g -= 5;
    } else if (color.r < 255 && color.g === 0 && color.b === 255) {
        newColor.r += 5;
    } else if (color.r === 255 && color.g === 0 && color.b > 0) {
        newColor.b -= 5;
    }

    return newColor;
};

const startRainbow = (changeColorHandler) => {
    currentColor = startColor;

    setInterval(() => {
        currentColor = moveRainbow(currentColor);

        const newColorPair = {
            color: convertColorToString(currentColor),
            negative: convertColorToString(inverseColor(currentColor)),
        };

        changeColorHandler(newColorPair);
    }, 200);
};

const stopRainbow = () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
};

export {
    startRainbow,
    stopRainbow,
};
