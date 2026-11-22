import {
    backgroundColorString,
    placeholderColorString,
    inverseColorString,
    getCurrentColorString,
    saveColorString,
} from './common.ts';
import { setIcon } from './icon.ts';

const hoverTargetElements = document.querySelectorAll('.hoverTarget');
const hoverTriggerElements = document.querySelectorAll('.hoverTrigger');

const setDefaultColors = () => {
    document.documentElement.style.setProperty('--placeholder-color', placeholderColorString);
    document.documentElement.style.setProperty('--background-color', backgroundColorString);
};

const updateColor = () => {
    const colorString = getCurrentColorString();
    const negativeColorString = inverseColorString(colorString);

    document.documentElement.style.setProperty('--main-color', colorString);
    document.documentElement.style.setProperty('--negative-color', negativeColorString);
};

const changeColor = (colorString: string) => {
    saveColorString(colorString);
    updateColor();
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
    setIcon();
    updateColor();
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
