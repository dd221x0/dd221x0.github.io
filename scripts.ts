import {
    initializeColorChange,
    uninitializeColorChange,
} from './colorChange/colorChange.ts';
import {
    startManual,
    stopManual,
} from './colorChange/triggers/manual.ts';
import {
    initializeTetrahedron,
    uninitializeTetrahedron,
} from './tetrahedron.ts';
import {
    registerNavigationHandler,
    initializeNavigationEffects,
    uninitializeNavigationEffects,
} from './navigationEffects/navigationEffects.ts';
import {
    initializeUtils,
    uninitializeUtils,
} from './utils.ts';
import { initializeEmail } from './email.ts';

let isInitialized = false;

let ignoreOnBeforeUnload = false;

const ignoreNextOnBeforeUnload = () => {
    ignoreOnBeforeUnload = true;
};

const initialize = () => {
    initializeColorChange();
    startManual();
    initializeTetrahedron();
    registerNavigationHandler(() => uninitialize(true));
    initializeNavigationEffects();
    initializeUtils();
    initializeEmail(ignoreNextOnBeforeUnload);

    isInitialized = true;
};

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
    if (ignoreOnBeforeUnload) {
        ignoreOnBeforeUnload = false;
        return;
    }

    uninitialize();
};
