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

const setColor = (elements) => {
    elements.forEach((el) => {
        el.style.color = currentColorPair.color;
    })
};

const setTriangleColor = (elements) => {
    elements.forEach((el) => {
        el.style.borderBottomColor = currentColorPair.color;
    });
};

const setBorderColor = (elements) => {
    elements.forEach((el) => {
        el.style.borderColor = currentColorPair.color;
    });
};

const setPlaceholderColor = (elements) => {
    elements.forEach((el) => {
        el.classList.add('active');
    });
};

const changeColor = (colorPair) => {
    currentColorPair = colorPair;

    setColor(targetElements);
    setTriangleColor(targetTriangleElements);
    setBorderColor(targetBorderElements);

    saveColor(currentColorPair);

    setIcon();
};

const setHoverColorChange = (elements) => {
    elements.forEach((el) => {
        el.onmouseover = () => {
            el.style.color = currentColorPair.negative;
        };

        el.onmouseout = () => {
            el.style.color = currentColorPair.color;
        };
    });
};

const setTriangleHoverColorChange = (elements) => {
    elements.forEach((el) => {
        el.onmouseover = () => {
            el.style.borderBottomColor = currentColorPair.negative;
        };

        el.onmouseout = () => {
            el.style.borderBottomColor = currentColorPair.color;
        };
    });
};

const setButtonHoverColorChange = (elements) => {
    elements.forEach((el) => {
        el.onmouseover = () => {
            el.style.borderColor = currentColorPair.negative;
            el.style.color = currentColorPair.negative;
        };
    
        el.onmouseout = () => {
            el.style.borderColor = currentColorPair.color;
            el.style.color = currentColorPair.color;
        };
    });
};

const setSwitchColorChange = (elements) => {
    elements.forEach((el) => {
        el.style.color = el.isActive ? currentColorPair.color : placeholderColor;
        el.addEventListener('click', () => {
            el.style.color = el.isActive ? currentColorPair.color : placeholderColor;
        });
    });
}

const initializeTargets = () => {
    setColor(targetElements);
    setTriangleColor(targetTriangleElements);
    setPlaceholderColor(targetPlaceholderElements);
    setHoverColorChange(targetHoverElements);
    setTriangleHoverColorChange(targetTriangleHoverElements);
    setButtonHoverColorChange(targetButtonHoverElements);
    setBorderColor(targetBorderElements);
    setSwitchColorChange(targetSwitchElements);
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
