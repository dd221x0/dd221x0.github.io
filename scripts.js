import {
    initializeColorChange,
    uninitializeColorChange,
} from './colorChange/colorChange.js';
import {
    startManual,
    stopManual,
} from './colorChange/triggers/manual.js';
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
    startManual();
    initializeTetrahedron();
    registerNavigationHandler(() => uninitialize(true));
    initializeNavigationEffects();
    initializeUtils();

    isInitialized = true;
}

const uninitialize = (isNavigation = false) => {
    stopManual();
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
