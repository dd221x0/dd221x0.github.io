import {
    getCurrentColorPair,
    placeholderColor,
    saveColor,
} from './common.js';
import { setIcon } from './icon.js';
import { startManual } from './strategies/manual.js';

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

const setColor = (color = currentColorPair.color) => {
    targetElements.forEach((el) => {
        el.style.color = color;
    })
};

const setTriangleColor = (color = currentColorPair.color) => {
    targetTriangleElements.forEach((el) => {
        el.style.backgroundColor = color;
    });
};

const setBorderColor = (color = currentColorPair.color) => {
    targetBorderElements.forEach((el) => {
        el.style.borderColor = color;
    });
};

const setPlaceholderColor = () => {
    targetPlaceholderElements.forEach((el) => {
        el.classList.add('active');
    });
};

const changeColor = (colorPair) => {
    currentColorPair = colorPair;

    setColor();
    setTriangleColor();
    setBorderColor();

    saveColor(currentColorPair);

    setIcon();
};

const setHoverColorChange = () => {
    targetHoverElements.forEach((el) => {
        el.addEventListener('mouseover', (event) => {
            el.style.color = currentColorPair.negative;
            setTriangleColor(currentColorPair.negative);
            return event;
        });

        addEventListener('mouseout', (event) => {
            el.style.color = currentColorPair.color;
            setTriangleColor(currentColorPair.color);
            return event;
        });
    });
};

const setTriangleHoverColorChange = () => {
    targetTriangleHoverElements.forEach((el) => {
        el.addEventListener('mouseover', (event) => {
            el.style.backgroundColor = currentColorPair.negative;
            return event;
        });

        addEventListener('mouseout', (event) => {
            el.style.backgroundColor = currentColorPair.color;
            return event;
        });
    });
};

const setButtonHoverColorChange = () => {
    targetButtonHoverElements.forEach((el) => {
        el.addEventListener('mouseover', (event) => {
            el.style.borderColor = currentColorPair.negative;
            el.style.color = currentColorPair.negative;
            return event;
        });
    
        addEventListener('mouseout', (event) => {
            el.style.borderColor = currentColorPair.color;
            el.style.color = currentColorPair.color;
            return event;
        });
    });
};

const setSwitchColorChange = () => {
    targetSwitchElements.forEach((el) => {
        el.style.color = el.isActive ? currentColorPair.color : placeholderColor;
        el.addEventListener('click', () => {
            el.style.color = el.isActive ? currentColorPair.color : placeholderColor;
        });
    });
}

const initializeTargets = () => {
    setColor();
    setTriangleColor();
    setPlaceholderColor();
    setHoverColorChange();
    setTriangleHoverColorChange();
    setButtonHoverColorChange();
    setBorderColor();
    setSwitchColorChange();
};

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
};
