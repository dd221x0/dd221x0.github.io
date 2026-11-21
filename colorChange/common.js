const defaultRgb = {r: 0xBB, g: 0xBB, b: 0xBB};
const placeholderColorString = '#888888';
const backgroundColorString = '#000000';

const rgbComponentToHex = (component) => component.toString(16).padStart(2, '0').toUpperCase();

const rgbToColorString = (rgb) => {
    const colorString = [rgb.r, rgb.g, rgb.b]
        .map(rgbComponentToHex)
        .join('');

    return `#${colorString}`;
};

const colorStringToRgb = (colorString) => {
    const r = Number.parseInt(colorString.slice(1, 3), 16);
    const g = Number.parseInt(colorString.slice(3, 5), 16);
    const b = Number.parseInt(colorString.slice(5, 7), 16);

    return {r, g, b};
};

const inverseRgbComponent = (component) => 0xFF - component;

const inverseRgb = (rgb) => ({
    r: inverseRgbComponent(rgb.r),
    g: inverseRgbComponent(rgb.g),
    b: inverseRgbComponent(rgb.b),
});

const assembleColorStringPair = (rgb) => {
    const negativeRgb = inverseRgb(rgb);

    return {
        color: rgbToColorString(rgb),
        negative: rgbToColorString(negativeRgb),
    };
};

const defaultColorStringPair = assembleColorStringPair(defaultRgb);

const getCurrentColorStringPair = () => {
    return JSON.parse(localStorage.getItem('colorStringPair')) || defaultColorStringPair;
};

const saveColorStringPair = (colorStringPair) => {
    localStorage.setItem('colorStringPair', JSON.stringify(colorStringPair));
};

export {
    defaultRgb,
    defaultColorStringPair,
    placeholderColorString,
    backgroundColorString,
    rgbComponentToHex,
    rgbToColorString,
    colorStringToRgb,
    assembleColorStringPair,
    getCurrentColorStringPair,
    saveColorStringPair,
};
