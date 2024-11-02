import {
    backgroundColor,
    getCurrentColorPair,
    placeholderColor,
    saveColor,
} from './common.js';
import { setIcon } from './icon.js';
import { 
    startManual,
    stopManual,
} from './strategies/manual.js';

let currentColorPair = getCurrentColorPair();

let triggerElements = [];
let targetElements = [];
let targetTriangleElements = [];
let targetPlaceholderElements = [];
let targetHoverElements = [];
let targetTriangleHoverElements = [];
let targetButtonHoverElements = [];
let targetBorderElements = [];
let targetSwitchElements = [];

const setColor = (color) => {
    targetElements.forEach((el) => {
        el.style.color = color;
    })
};

const setTriangleColor = (color) => {
    targetTriangleElements.forEach((el) => {
        el.style.backgroundColor = color;
    });
};

const setBorderColor = (color) => {
    targetBorderElements.forEach((el) => {
        el.style.borderColor = color;
    });
};

const setPlaceholderColor = (isActive = true) => {
    targetPlaceholderElements.forEach((el) => {
        if (isActive) {
            el.classList.add('active');
            return;
        }

        el.classList.remove('active');
    });
};

const updateColor = (color = currentColorPair.color) => {
    setColor(color);
    setTriangleColor(color);
    setBorderColor(color);
};

const changeColor = (colorPair) => {
    currentColorPair = colorPair;

    updateColor();

    saveColor(currentColorPair);

    setIcon();
};

const handleMouseOver = (event) => {
    event.currentTarget.style.color = currentColorPair.negative;
    setTriangleColor(currentColorPair.negative);
};

const handleMouseOut = (event) => {
    event.currentTarget.style.color = currentColorPair.color;
    setTriangleColor(currentColorPair.color);
};

const configureHoverColorChange = () => {
    targetHoverElements.forEach((el) => {
        el.addEventListener('mouseover', handleMouseOver);
        el.addEventListener('mouseout', handleMouseOut);
    });
};

const removeHoverColorChange = () => {
    targetHoverElements.forEach((el) => {
        el.removeEventListener('mouseover', handleMouseOver);
        el.removeEventListener('mouseout', handleMouseOut);
    });
};

const handleTriangleMouseOver = (event) => {
    event.currentTarget.style.backgroundColor = currentColorPair.negative;
};

const handleTriangleMouseOut = (event) => {
    event.currentTarget.style.backgroundColor = currentColorPair.color;
};

const configureTriangleHoverColorChange = () => {
    targetTriangleHoverElements.forEach((el) => {
        el.addEventListener('mouseover', handleTriangleMouseOver);
        el.addEventListener('mouseout', handleTriangleMouseOut);
    });
};

const removeTriangleHoverColorChange = () => {
    targetTriangleHoverElements.forEach((el) => {
        el.removeEventListener('mouseover', handleTriangleMouseOver);
        el.removeEventListener('mouseout', handleTriangleMouseOut);
    });
};

const handleButtonMouseOver = (event) => {
    event.currentTarget.style.borderColor = currentColorPair.negative;
    event.currentTarget.style.color = currentColorPair.negative;
};

const handleButtonMouseOut = (event) => {
    event.currentTarget.style.borderColor = currentColorPair.color;
    event.currentTarget.style.color = currentColorPair.color;
};

const configureButtonHoverColorChange = () => {
    targetButtonHoverElements.forEach((el) => {
        el.addEventListener('mouseover', handleButtonMouseOver);
        el.addEventListener('mouseout', handleButtonMouseOut);
    });
};

const removeButtonHoverColorChange = () => {
    targetButtonHoverElements.forEach((el) => {
        el.removeEventListener('mouseover', handleButtonMouseOver);
        el.removeEventListener('mouseout', handleButtonMouseOut);
    });
};

const handleSwitchClick = (event) => {
    const el = event.currentTarget;
    el.style.color = el.isActive ? currentColorPair.color : placeholderColor;
};

const configureSwitchColorChange = () => {
    targetSwitchElements.forEach((el) => {
        el.style.color = el.isActive ? currentColorPair.color : placeholderColor;
        el.addEventListener('click', handleSwitchClick);
    });
};

const removeSwitchColorChange = () => {
    targetSwitchElements.forEach((el) => {
        el.removeEventListener('click', handleSwitchClick);
    });
};

const initializeTargets = () => {
    updateColor();
    setPlaceholderColor();

    configureHoverColorChange();
    configureTriangleHoverColorChange();
    configureButtonHoverColorChange();
    configureSwitchColorChange();
};

const deinitializeTargets = () => {
    updateColor(backgroundColor);
    setPlaceholderColor(false);

    removeHoverColorChange();
    removeTriangleHoverColorChange();
    removeButtonHoverColorChange();
    removeSwitchColorChange();
}

const registerTriggerElements = (elements) => {
    triggerElements = [ ...triggerElements, ...elements ];
};

const registerTargetElements = (elements) => {
    targetElements = [ ...targetElements, ...elements ];
};

const registerTargetTriangleElements = (elements) => {
    targetTriangleElements = [ ...targetTriangleElements, ...elements ];
};

const registerTargetPlaceholderElements = (elements) => {
    targetPlaceholderElements = [ ...targetPlaceholderElements, ...elements ];
};

const registerTargetHoverElements = (elements) => {
    targetHoverElements = [ ...targetHoverElements, ...elements ];
};

const registerTargetTriangleHoverElements = (elements) => {
    targetTriangleHoverElements = [ ...targetTriangleHoverElements, ...elements ];
};

const registerTargetButtonHoverElements = (elements) => {
    targetButtonHoverElements = [ ...targetButtonHoverElements, ...elements ];
}

const registerTargetBorderElements = (elements) => {
    targetBorderElements = [ ...targetBorderElements, ...elements ];
};

const registerTargetSwitchElements = (elements) => {
    targetSwitchElements = [ ...targetSwitchElements, ...elements ];
};

const initializeColorChange = () => {
    setIcon();
    initializeTargets();
    startManual(triggerElements, changeColor);
};

const deinitializeColorChange = () => {
    deinitializeTargets();
    stopManual();
};

export {
    registerTriggerElements,
    registerTargetElements,
    registerTargetTriangleElements,
    registerTargetPlaceholderElements,
    registerTargetHoverElements,
    registerTargetTriangleHoverElements,
    registerTargetButtonHoverElements,
    registerTargetBorderElements,
    registerTargetSwitchElements,
    initializeColorChange,
    deinitializeColorChange,
};
