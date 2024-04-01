import {
    convertColorToString,
    inverseColor,
} from './common.js';

const getRandomColorPair = () => {
    const color = {
        r: generateColorComponent(),
        g: generateColorComponent(),
        b: generateColorComponent(),
    }

    const negative = inverseColor(color);

    return { 
        color: convertColorToString(color),
        negative: convertColorToString(negative),
    };
};

const generateColorComponent = () => Math.random() * 0xFF << 0;

export {
    getRandomColorPair,
    inverseColor,
};
