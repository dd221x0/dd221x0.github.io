import { defaultColorPair } from "../common.js";
import { getRandomColorPair } from "../randomColorGenerator.js";

let triggerElements = [];
let changeColor = () => {};

const clickColorChangeListener = (event) => {
    changeColor(getRandomColorPair());
    event.stopPropagation();
    event.preventDefault();
};

const clickColorResetListener = (event) => {
    changeColor(defaultColorPair);
    event.stopPropagation();
    event.preventDefault();
};

const startManual = (elements, changeColorHandler) => {
    elements.forEach((triggerElement) => {
        triggerElement.addEventListener('click', clickColorChangeListener);
        triggerElement.addEventListener('contextmenu', clickColorResetListener);
        triggerElement.style.cursor = 'pointer';
    });

    triggerElements = elements;
    changeColor = changeColorHandler;
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
