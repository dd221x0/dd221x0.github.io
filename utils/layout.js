import {
    initializeColorChange,
    uninitializeColorChange,
} from '../colorChange/colorChange.js';
import {
    registerNavigationHandler,
    initializeNavigationEffects,
    uninitializeNavigationEffects,
} from '../navigationEffects/navigationEffects.js';

let isInitialized = false;

let customUnloadHandler = null;

export const registerCustomUnloadHandler = (handler) => {
    customUnloadHandler = handler;
};

const initializeLayout = () => {
    initializeColorChange();
    registerNavigationHandler(uninitializeLayout);
    initializeNavigationEffects();

    isInitialized = true;
};

const uninitializeLayout = () => {
    uninitializeColorChange();
    uninitializeNavigationEffects();

    if (customUnloadHandler) {
        customUnloadHandler();
    }

    isInitialized = false;
};

window.onpageshow = () => {
    if (!isInitialized) {
        initializeLayout();
    }
};

window.onbeforeunload = () => {
    uninitializeLayout();
};
