import {
    initializeColorChange,
    uninitializeColorChange,
} from './colorChange/colorChange.js';
import {
    initializeTetrahedron,
    uninitializeTetrahedron,
} from './tetrahedron.js';
import {
    registerNavigationHandler,
    initializeNavigationEffects,
    uninitializeNavigationEffects,
} from './navigationEffects/navigationEffects.js';
import {
    initializeUtils,
    uninitializeUtils,
} from './utils.js';

let isInitialized = false;

const initialize = () => {
    initializeColorChange();
    initializeTetrahedron();
    registerNavigationHandler(() => uninitialize(true));
    initializeNavigationEffects();
    initializeUtils();

    isInitialized = true;
}

const uninitialize = (isNavigation = false) => {
    uninitializeColorChange();
    uninitializeTetrahedron(isNavigation);
    uninitializeNavigationEffects();
    uninitializeUtils();

    isInitialized = false;
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

    uninitialize();
};
