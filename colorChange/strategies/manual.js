import { defaultColorStringPair } from "../common.js";
import { getRandomColorPair } from "../randomColorGenerator.js";
import { changeColor } from "../colorChange.js";

const triggerElements = [...document.getElementsByClassName('trigger')];

const clickColorChangeListener = (event) => {
    changeColor(getRandomColorPair());
    event.stopPropagation();
    event.preventDefault();
};

const clickColorResetListener = (event) => {
    changeColor(defaultColorStringPair);
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
        delete triggerElement.style.cursor;
    });
};

export {
    startManual,
    stopManual,
};
