import {
    registerTargetElements,
    registerTargetTriangleElements,
    initializeColorChange,
    registerTargetTriangleHoverElements,
    registerTargetButtonHoverElements,
    registerTargetBorderElements,
    registerTargetPlaceholderElements,
    deinitializeColorChange,
} from '../colorChange/colorChange.js';
import {
    registerNavigationElements,
    registerNavigationHandler,
    initializeNavigationEffects,
    deinitializeNavigationEffects,
} from '../navigationEffects/navigationEffects.js';

let isInitialized = false;

const inputs = document.querySelectorAll('input');
const buttons = document.querySelectorAll('button');
const result = document.getElementById('result');
const homeButton = document.getElementById('triangle');

const elementsWithBorder = [
    ...inputs,
    ...buttons,
];

const allElements = [
    ...elementsWithBorder,
    ...(result ? [ result ] : []),
];

const registerLayoutElements = () => {
    registerTargetElements(allElements);
    registerTargetTriangleElements([homeButton]);
    registerTargetTriangleHoverElements([homeButton]);
    registerTargetButtonHoverElements(buttons);
    registerTargetBorderElements(elementsWithBorder);
    registerTargetPlaceholderElements(inputs);

    registerNavigationElements([homeButton.parentElement]);
    registerNavigationHandler(deinitializeLayout);
};

const initializeLayout = () => {
    initializeColorChange();
    initializeNavigationEffects();

    isInitialized = true;
};

const deinitializeLayout = () => {
    deinitializeColorChange();
    deinitializeNavigationEffects();

    isInitialized = false;
};

window.onpageshow = () => {
    if (!isInitialized) {
        initializeLayout();
    }
};

window.onbeforeunload = () => {
    deinitializeLayout();
};

export {
    registerLayoutElements,
}
