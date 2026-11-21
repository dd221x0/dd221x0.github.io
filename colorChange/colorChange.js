import {
    backgroundColorString,
    placeholderColorString,
    rgbToColorString,
    colorStringToRgb,
    inverseRgb,
    getCurrentColorString,
    saveColorString,
} from './common.js';
import { setIcon } from './icon.js';

const hoverTargetElements = [...document.getElementsByClassName('hoverTarget')];
const hoverTriggerElements = [...document.getElementsByClassName('hoverTrigger')];

const setDefaultColors = () => {
    document.documentElement.style.setProperty('--placeholder-color', placeholderColorString);
    document.documentElement.style.setProperty('--background-color', backgroundColorString);
};

const updateColor = (rgb) => {
    const negativeRgb = inverseRgb(rgb);
    const colorString = rgbToColorString(rgb);
    const negativeColorString = rgbToColorString(negativeRgb);

    document.documentElement.style.setProperty('--main-color', colorString);
    document.documentElement.style.setProperty('--negative-color', negativeColorString);
};

const changeColor = (rgb) => {
    const colorString = rgbToColorString(rgb);

    updateColor(rgb);
    saveColorString(colorString);
    setIcon();
};

const setTargetColor = (inverse = false) => {
    hoverTargetElements.forEach((el) => {
        if (inverse) {
            el.classList.add('negative');
            return;
        }

        el.classList.remove('negative');
    });
};

const handleMouseOver = () => {
    setTargetColor(true);
};

const handleMouseOut = () => {
    setTargetColor();
};

const configureHoverColorChange = () => {
    hoverTriggerElements.forEach((el) => {
        el.addEventListener('mouseover', handleMouseOver);
        el.addEventListener('mouseout', handleMouseOut);
    });
};

const removeHoverColorChange = () => {
    hoverTriggerElements.forEach((el) => {
        el.removeEventListener('mouseover', handleMouseOver);
        el.removeEventListener('mouseout', handleMouseOut);
    });
};

const hideColor = () => {
    document.documentElement.style.setProperty('--main-color', backgroundColorString);
    document.documentElement.style.setProperty('--negative-color', backgroundColorString);
    document.documentElement.style.setProperty('--placeholder-color', backgroundColorString);
};

const initializeColorChange = () => {
    const colorString = getCurrentColorString();
    const rgb = colorStringToRgb(colorString);

    setIcon();
    updateColor(rgb);
    setDefaultColors();
    configureHoverColorChange();
};

const uninitializeColorChange = () => {
    hideColor();
    removeHoverColorChange();
};

export {
    initializeColorChange,
    uninitializeColorChange,
    changeColor,
};
