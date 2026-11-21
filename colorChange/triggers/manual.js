import { defaultRgb } from "../common.js";
import { getRandomRgb } from "../randomColorGenerator.js";
import { changeColor } from "../colorChange.js";

const triggerElements = [...document.getElementsByClassName('trigger')];

const clickColorChangeListener = (event) => {
    changeColor(getRandomRgb());
    event.stopPropagation();
    event.preventDefault();
};

const clickColorResetListener = (event) => {
    changeColor(defaultRgb);
    event.stopPropagation();
    event.preventDefault();
};

const startManual = () => {
    triggerElements.forEach((triggerElement) => {
        triggerElement.addEventListener('click', clickColorChangeListener);
        triggerElement.addEventListener('contextmenu', clickColorResetListener);
        triggerElement.style.cursor = 'pointer';
    });
};

const stopManual = () => {
    triggerElements.forEach((triggerElement) => {
        triggerElement.removeEventListener('click', clickColorChangeListener);
        triggerElement.removeEventListener('contextmenu', clickColorResetListener);
        triggerElement.style.removeProperty('cursor');
    });
};

export {
    startManual,
    stopManual,
};
