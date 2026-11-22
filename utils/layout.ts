import {
    initializeColorChange,
    uninitializeColorChange,
} from '../colorChange/colorChange.ts';
import {
    registerNavigationHandler,
    initializeNavigationEffects,
    uninitializeNavigationEffects,
} from '../navigationEffects/navigationEffects.ts';

let isInitialized = false;

let customUnloadHandler: (() => void) | null = null;

export const registerCustomUnloadHandler = (handler: () => void) => {
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
