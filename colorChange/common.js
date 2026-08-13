const defaultColorStringPair = {color: '#BBBBBB', negative: '#444444'};
const placeholderColorString = '#888888';
const backgroundColorString = '#000000';

const getCurrentColorStringPair = () => {
    return JSON.parse(localStorage.getItem('colorStringPair')) || defaultColorStringPair;
};

const saveColorStringPair = (colorStringPair) => {
    localStorage.setItem('colorStringPair', JSON.stringify(colorStringPair));
};

const convertColorToString = (color) => {
    const colorString = [color.r, color.g, color.b]
        .map((c) => c.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

    return `#${colorString}`;
};

const parseColorString = (colorString) => {
    const r = Number.parseInt(colorString.slice(1, 3), 16);
    const g = Number.parseInt(colorString.slice(3, 5), 16);
    const b = Number.parseInt(colorString.slice(5, 7), 16);

    return {r, g, b};
};

const inverseColorComponent = (colorComponent) => 0xFF - colorComponent;

const inverseColor = (color) => ({
    r: inverseColorComponent(color.r),
    g: inverseColorComponent(color.g),
    b: inverseColorComponent(color.b),
});

const assembleColorStringPair = (color) => {
    const negative = inverseColor(color);

    return {
        color: convertColorToString(color),
        negative: convertColorToString(negative),
    };
};

export {
    defaultColorStringPair,
    placeholderColorString,
    backgroundColorString,
    getCurrentColorStringPair,
    saveColorStringPair,
    parseColorString,
    assembleColorStringPair,
};
