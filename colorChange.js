import {
    defaultColor,
    getCurrentColor,
} from './common.js';
import { setIcon } from './icon.js';

let currentColor = getCurrentColor();

let triggerElements = [];
let targetElements = [];
let targetTriangleElements = [];
let targetPlaceholderElements = [];
let targetHoverElements = [];
let targetTriangleHoverElements = [];
let targetButtonHoverElements = [];
let targetBorderElements = [];

const getRandomColor = () => {
    const color = {
        r: generateColorComponent(),
        g: generateColorComponent(),
        b: generateColorComponent(),
    }

    const negative = {
        r: inverseColorComponent(color.r),
        g: inverseColorComponent(color.g),
        b: inverseColorComponent(color.b),
    }

    return { 
        color: convertColorToString(color),
        negative: convertColorToString(negative),
    };
};

const generateColorComponent = () => Math.random() * 0xFF << 0;

const inverseColorComponent = (colorComponent) => 0xFF - colorComponent;

const convertColorToString = (color) => {
    const colorString = [color.r, color.g, color.b]
        .map((c) => c.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

    return `#${colorString}`;
};

const saveColor = (color) => {
    localStorage.setItem('color', JSON.stringify(color));
};

const setColor = (elements) => {
    elements.forEach((el) => {
        el.style.color = currentColor.color;
    })
};

const setTriangleColor = (elements) => {
    elements.forEach((el) => {
        el.style.borderBottomColor = currentColor.color;
    });
};

const setBorderColor = (elements) => {
    elements.forEach((el) => {
        el.style.borderColor = currentColor.color;
    });
};

const setPlaceholderColor = (elements) => {
    elements.forEach((el) => {
        el.classList.add('active');
    });
};

const changeColor = (color) => {
    currentColor = color;

    setColor(targetElements);
    setTriangleColor(targetTriangleElements);

    saveColor(currentColor);

    setIcon();
};

const setHoverColorChange = (elements) => {
    elements.forEach((el) => {
        el.onmouseover = () => {
            el.style.color = currentColor.negative;
        };

        el.onmouseout = () => {
            el.style.color = currentColor.color;
        };
    });
};

const setTriangleHoverColorChange = (elements) => {
    elements.forEach((el) => {
        el.onmouseover = () => {
            el.style.borderBottomColor = currentColor.negative;
        };

        el.onmouseout = () => {
            el.style.borderBottomColor = currentColor.color;
        };
    });
};

const setButtonHoverColorChange = (elements) => {
    elements.forEach((el) => {
        el.onmouseover = () => {
            el.style.borderColor = currentColor.negative;
            el.style.color = currentColor.negative;
        };
    
        el.onmouseout = () => {
            el.style.borderColor = currentColor.color;
            el.style.color = currentColor.color;
        };
    });
};

const setClickColorChange = (element) => {
    element.addEventListener('click', (e) => {
        changeColor(getRandomColor());
        e.stopPropagation();
    });
};

const setDoubleClickColorChange = (element) => {
    element.addEventListener('dbclick', (e) => {
        changeColor(defaultColor);
        e.stopPropagation();
    });
};

const initializeTriggers = () => {
    triggerElements.forEach((triggerElement) => {
        setClickColorChange(triggerElement);
        setDoubleClickColorChange(triggerElement);
    });
};

const initializeTargets = () => {
    setColor(targetElements);
    setTriangleColor(targetTriangleElements);
    setPlaceholderColor(targetPlaceholderElements);
    setHoverColorChange(targetHoverElements);
    setTriangleHoverColorChange(targetTriangleHoverElements);
    setButtonHoverColorChange(targetButtonHoverElements);
    setBorderColor(targetBorderElements);
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

const initializeColorChange = () => {
    setIcon();
    initializeTriggers();
    initializeTargets();
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
    initializeColorChange,
};
