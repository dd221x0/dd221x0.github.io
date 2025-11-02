import {
    backgroundColor,
    getCurrentColorPair,
    placeholderColor,
    saveColor,
} from './common.js';
import { setIcon } from './icon.js';
import { 
    startManual,
    stopManual,
} from './strategies/manual.js';

const triggerElements = [...document.getElementsByClassName('trigger')];
const hoverTargetElements = [...document.getElementsByClassName('hoverTarget')];
const hoverTriggerElements = [...document.getElementsByClassName('hoverTrigger')];

const updateColor = (colorPair) => {
    document.documentElement.style.setProperty('--main-color', colorPair.color);
    document.documentElement.style.setProperty('--negative-color', colorPair.negative);
    document.documentElement.style.setProperty('--placeholder-color', placeholderColor);
};

const changeColor = (colorPair) => {
    updateColor(colorPair);
    saveColor(colorPair);
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
    document.documentElement.style.setProperty('--main-color', backgroundColor);
    document.documentElement.style.setProperty('--negative-color', backgroundColor);
    document.documentElement.style.setProperty('--placeholder-color', backgroundColor);
};

const initializeColorChange = () => {
    setIcon();
    updateColor(getCurrentColorPair());
    configureHoverColorChange();
    startManual(triggerElements, changeColor);
};

const uninitializeColorChange = () => {
    hideColor();
    removeHoverColorChange();
    stopManual();
};

export {
    initializeColorChange,
    uninitializeColorChange,
};
