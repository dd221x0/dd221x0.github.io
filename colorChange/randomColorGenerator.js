import { rgbToColorString } from './common.js';

const generateRgbComponent = () => Math.trunc(Math.random() * 0x100);

const getRandomColorString = () => {
    const rgb = {
        r: generateRgbComponent(),
        g: generateRgbComponent(),
        b: generateRgbComponent(),
    };

    return rgbToColorString(rgb);
};

export {
    getRandomColorString,
};
