import {
    backgroundColorString,
    getCurrentColorStringPair,
    saveColorStringPair,
    placeholderColorString,
} from './common.js';
import { setIcon } from './icon.js';
import { 
    startManual,
    stopManual,
} from './strategies/manual.js';

const hoverTargetElements = [...document.getElementsByClassName('hoverTarget')];
const hoverTriggerElements = [...document.getElementsByClassName('hoverTrigger')];

const setDefaultColors = () => {
    document.documentElement.style.setProperty('--placeholder-color', placeholderColorString);
    document.documentElement.style.setProperty('--background-color', backgroundColorString);
};

const updateColor = (colorStringPair) => {
    document.documentElement.style.setProperty('--main-color', colorStringPair.color);
    document.documentElement.style.setProperty('--negative-color', colorStringPair.negative);
};

const changeColor = (colorStringPair) => {
    updateColor(colorStringPair);
    saveColorStringPair(colorStringPair);
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
    updateColor(getCurrentColorStringPair());
    setDefaultColors();
    configureHoverColorChange();
    startManual();
};

const uninitializeColorChange = () => {
    hideColor();
    removeHoverColorChange();
    stopManual();
};

export {
    initializeColorChange,
    uninitializeColorChange,
    changeColor,
};
