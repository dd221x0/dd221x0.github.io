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
    registerNavigationElements,
    registerNavigationHandler,
    initializeNavigationEffects,
    deinitializeNavigationEffects,
} from './navigationEffects/navigationEffects.js';

let isInitialized = false;

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

const registerElements = () => {
    registerTriggerElements(tetrahedronTriangles);
    registerTargetElements(allElements);
    registerTargetTriangleElements(tetrahedronTriangles);
    registerTargetHoverElements(controls);

    registerTetrahedron(tetrahedron);
    registerTriggerHoverElements(controls);

    registerNavigationElements(utilsLinks);
    registerNavigationHandler(() => deinitialize(true));
};

const initialize = () => {
    initializeColorChange();
    initializeTetrahedron();
    initializeNavigationEffects();

    isInitialized = true;
}

const deinitialize = (isNavigation = false) => {
    deinitializeColorChange();
    deinitializeTetrahedron(isNavigation);
    deinitializeNavigationEffects();

    isInitialized = false;
};

window.onload = () => {
    registerElements();
};

window.onpageshow = () => {
    if (!isInitialized) {
        initialize();
    }
};

window.onbeforeunload = () => {
    if (window.ignoreOnBeforeUnload) {
        window.ignoreOnBeforeUnload = false;
        return;
    }

    deinitialize();
};
