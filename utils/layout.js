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

const initializeLayout = () => {
    initializeColorChange();
    registerNavigationHandler(uninitializeLayout);
    initializeNavigationEffects();

    isInitialized = true;
};

const uninitializeLayout = () => {
    uninitializeColorChange();
    uninitializeNavigationEffects();

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
