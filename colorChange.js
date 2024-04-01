import {
    defaultColor,
    getCurrentColor,
} from './common.js';
import { setIcon } from './icon.js';

let currentColor = getCurrentColor();

let triggerElements = [];
let targetElements = [];
let targetBorderElements = [];
let targetHoverElements = [];

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
    elements.forEach((e) => {
        e.style.color = currentColor.color;
    })
};

const setBorderColor = (elements) => {
    elements.forEach((el) => {
        el.style.borderBottomColor = currentColor.color;
    });
};

const changeColor = (color) => {
    currentColor = color;

    setColor(targetElements);
    setBorderColor(targetBorderElements);

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
    })
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
    setBorderColor(targetBorderElements);
    setHoverColorChange(targetHoverElements);
};

const registerTriggerElements = (elements) => {
    triggerElements = [...elements];
};

const registerTargetElements = (elements) => {
    targetElements = [...elements];
};

const registerTargetBorderElements = (elements) => {
    targetBorderElements = [...elements];
};

const registerTargetHoverElements = (elements) => {
    targetHoverElements = [...elements];
};

const initializeColorChange = () => {
    initializeTriggers();
    initializeTargets();
    setIcon();
};

export {
    registerTriggerElements,
    registerTargetElements,
    registerTargetBorderElements,
    registerTargetHoverElements,
    initializeColorChange,
};
