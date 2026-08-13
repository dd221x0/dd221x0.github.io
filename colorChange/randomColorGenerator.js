import {
    assembleColorStringPair,
} from './common.js';

const generateColorComponent = () => Math.random() * 0xFF << 0;

const getRandomColorPair = () => {
    const color = {
        r: generateColorComponent(),
        g: generateColorComponent(),
        b: generateColorComponent(),
    };

    return assembleColorStringPair(color);
};

export {
    getRandomColorPair,
};
