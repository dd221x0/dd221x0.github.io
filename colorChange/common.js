const defaultColorString = '#BBBBBB';
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

const getCurrentColorString = () => {
    return localStorage.getItem('color') || defaultColorString;
};

const saveColorString = (colorString) => {
    localStorage.setItem('color', colorString);
};

export {
    defaultColorString,
    placeholderColorString,
    backgroundColorString,
    rgbComponentToHex,
    rgbToColorString,
    colorStringToRgb,
    inverseRgb,
    getCurrentColorString,
    saveColorString,
};
