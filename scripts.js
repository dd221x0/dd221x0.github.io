import {
    registerTriggerElements,
    registerTargetElements,
    registerTargetTriangleElements,
    registerTargetHoverElements,
    initializeColorChange,
    deinitializeColorChange,
} from './colorChange/colorChange.js';
import {
    registerTetrahedron,
    registerTriggerHoverElements,
    initializeTetrahedron,
    deinitializeTetrahedron,
} from './tetrahedron.js';
import {
    initializeNavigationEffects,
    registerNavigationElements,
    registerNavigationHandler,
} from './navigationEffects/navigationEffects.js';

const tetrahedron = document.querySelector('#tetrahedron');
const tetrahedronTriangles = document.querySelectorAll('#tetrahedron .triangle');
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
    registerTriggerElements(tetrahedronTriangles);
    registerTargetElements(allElements);
    registerTargetTriangleElements(tetrahedronTriangles);
    registerTargetHoverElements(controls);
    initializeColorChange();

    registerTetrahedron(tetrahedron);
    registerTriggerHoverElements(controls);
    initializeTetrahedron();

    registerNavigationElements(utilsLinks);
    registerNavigationHandler(() => deinitialize(true));
    initializeNavigationEffects();
}

const deinitialize = (isNavigation = false) => {
    deinitializeColorChange();
    deinitializeTetrahedron(isNavigation);
};

window.onload = () => {
    initialize();
};

window.onbeforeunload = () => {
    deinitialize();
};
