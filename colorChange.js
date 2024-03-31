import {
    defaultColor,
    getCurrentColor,
} from "./common.js";

let currentColor = getCurrentColor();

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
}

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
}

const setHoverColorChange = (elements) => {
    elements.forEach((el) => {
        el.onmouseover = () => {
            el.style.color = currentColor.negative;
        };
        el.onmouseout = () => {
            el.style.color = currentColor.color;
        };
    })
}

const setClickColorChange = (
    triggerElement,
    targetElements,
    targetBorderElements,
) => {
    triggerElement.addEventListener('click', (e) => {
        currentColor = getRandomColor();

        setColor(targetElements);
        setBorderColor(targetBorderElements);

        saveColor(currentColor);

        e.stopPropagation();
    });
};

const setDoubleClickColorChange = (
    triggerElement,
    targetElements,
    targetBorderElements,
) => {
    triggerElement.addEventListener('dbclick', (e) => {
        currentColor = defaultColor;

        setColor(targetElements);
        setBorderColor(targetBorderElements);

        saveColor(currentColor);

        e.stopPropagation();
    });
};

export {
    setColor,
    setBorderColor,
    setHoverColorChange,
    setClickColorChange,
    setDoubleClickColorChange,
};
