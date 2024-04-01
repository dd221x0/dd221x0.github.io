import {
    registerTargetElements,
    registerTargetTriangleElements,
    initializeColorChange,
    registerTargetTriangleHoverElements,
    registerTargetButtonHoverElements,
    registerTargetBorderElements,
    registerTargetPlaceholderElements,
} from '../colorChange.js';

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
};

export {
    initializeLayout,
}
