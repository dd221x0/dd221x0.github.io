type Rgb = {
    r: number;
    g: number;
    b: number;
};

const defaultColorString = '#BBBBBB';
const placeholderColorString = '#888888';
const backgroundColorString = '#000000';

const rgbComponentToHex = (component: number) => component.toString(16).padStart(2, '0').toUpperCase();

const rgbToColorString = (rgb: Rgb) => {
    const colorString = [rgb.r, rgb.g, rgb.b]
        .map(rgbComponentToHex)
        .join('');

    return `#${colorString}`;
};

const colorStringToRgb = (colorString: string): Rgb => {
    const r = Number.parseInt(colorString.slice(1, 3), 16);
    const g = Number.parseInt(colorString.slice(3, 5), 16);
    const b = Number.parseInt(colorString.slice(5, 7), 16);

    return {r, g, b};
};

const inverseRgbComponent = (component: number) => 0xFF - component;

const inverseRgb = (rgb: Rgb): Rgb => ({
    r: inverseRgbComponent(rgb.r),
    g: inverseRgbComponent(rgb.g),
    b: inverseRgbComponent(rgb.b),
});

const inverseColorString = (colorString: string) => {
    const rgb = colorStringToRgb(colorString);
    const negativeRgb = inverseRgb(rgb);

    return rgbToColorString(negativeRgb);
};

const getCurrentColorString = () => {
    return localStorage.getItem('color') || defaultColorString;
};

const getCurrentRgb = () => {
    const colorString = getCurrentColorString();

    return colorStringToRgb(colorString);
};

const saveColorString = (colorString: string) => {
    localStorage.setItem('color', colorString);
};

export {
    type Rgb,
    defaultColorString,
    placeholderColorString,
    backgroundColorString,
    rgbComponentToHex,
    rgbToColorString,
    colorStringToRgb,
    inverseColorString,
    getCurrentColorString,
    getCurrentRgb,
    saveColorString,
};
