import {
    registerTriggerElements,
	registerTargetElements,
	registerTargetTriangleElements,
	registerTargetHoverElements,
	initializeColorChange,
} from './colorChange/colorChange.js';

const tetrahedronParts = document.querySelectorAll('#tetrahedron div');
const socialLinks = document.querySelectorAll('#social a');
const email = document.querySelector('#email a');
const utilsHeader = document.querySelector('#utils h3');
const utilsLinks = document.querySelectorAll('#utils a');

const controls = [
    ...socialLinks,
    ...utilsLinks,
    email,
];

const allElements = [
    ...controls,
    utilsHeader,
];

const initialize = () => {
	registerTriggerElements(tetrahedronParts);
    registerTargetElements(allElements);
    registerTargetTriangleElements(tetrahedronParts);
    registerTargetHoverElements(controls);
	initializeColorChange();
}

window.onload = () => {
    initialize();
};
