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
    initializeNavigationEffects,
    registerNavigationElements,
    registerNavigationHandler,
} from '../navigationEffects/navigationEffects.js';

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

const initializeLayout = () => {
    registerTargetElements(allElements);
    registerTargetTriangleElements([homeButton]);
    registerTargetTriangleHoverElements([homeButton]);
    registerTargetButtonHoverElements(buttons);
    registerTargetBorderElements(elementsWithBorder);
    registerTargetPlaceholderElements(inputs);
    initializeColorChange();

    registerNavigationElements([homeButton.parentElement]);
    registerNavigationHandler(deinitializeLayout);
    initializeNavigationEffects();
};

const deinitializeLayout = () => {
    deinitializeColorChange();
};

window.onbeforeunload = () => {
    deinitializeLayout();
};

export {
    initializeLayout,
}
