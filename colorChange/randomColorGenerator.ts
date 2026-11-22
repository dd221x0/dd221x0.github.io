import { type Rgb, rgbToColorString } from './common.ts';

const generateRgbComponent = () => Math.trunc(Math.random() * 0x100);

const getRandomColorString = () => {
    const rgb: Rgb = {
        r: generateRgbComponent(),
        g: generateRgbComponent(),
        b: generateRgbComponent(),
    };

    return rgbToColorString(rgb);
};

export {
    getRandomColorString,
};
