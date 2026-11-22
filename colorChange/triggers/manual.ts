import { defaultColorString } from "../common.ts";
import { getRandomColorString } from "../randomColorGenerator.ts";
import { changeColor } from "../colorChange.ts";

const triggerElements = document.querySelectorAll<HTMLElement>('.trigger');

const clickColorChangeListener = (event: MouseEvent) => {
    const randomColorString = getRandomColorString();

    changeColor(randomColorString);
    event.stopPropagation();
    event.preventDefault();
};

const clickColorResetListener = (event: MouseEvent) => {
    changeColor(defaultColorString);
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
