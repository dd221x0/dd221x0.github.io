const defaultColorPair = {color: '#BBBBBB', negative: '#444444'};
const placeholderColor = '#888888'; 

const getCurrentColorPair = () => {
    return JSON.parse(localStorage.getItem('color')) || defaultColorPair;
};

const saveColor = (color) => {
    localStorage.setItem('color', JSON.stringify(color));
};

const convertColorToString = (color) => {
    const colorString = [color.r, color.g, color.b]
        .map((c) => c.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

    return `#${colorString}`;
};

const inverseColorComponent = (colorComponent) => 0xFF - colorComponent;

const inverseColor = (color) => ({
    r: inverseColorComponent(color.r),
    g: inverseColorComponent(color.g),
    b: inverseColorComponent(color.b),
});

export {
    defaultColorPair,
    placeholderColor,
    getCurrentColorPair,
    saveColor,
    convertColorToString,
    inverseColor,
}
