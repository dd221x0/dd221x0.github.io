import { registerCustomUnloadHandler } from '../layout.js';
import {
    saveOldValue,
    restoreOldValue,
    isHex,
    isDigit,
    updateUrl,
} from '../common.js';
import {
    getCurrentColorStringPair,
    parseColorString,
    assembleColorStringPair,
    backgroundColorString,
} from '../../colorChange/common.js';
import { changeColor } from '../../colorChange/colorChange.js';

const hexSwitch = document.getElementById('hex');
const redInput = document.getElementById('red');
const greenInput = document.getElementById('green');
const blueInput = document.getElementById('blue');
const preview = document.getElementById('preview');
const applyButton = document.getElementById('apply');

const rgbInputs = [redInput, greenInput, blueInput];

const initializeInputs = (color) => {
    redInput.value = color.r.toString(16).padStart(2, '0').toUpperCase();
    greenInput.value = color.g.toString(16).padStart(2, '0').toUpperCase();
    blueInput.value = color.b.toString(16).padStart(2, '0').toUpperCase();
};

const updateInputColors = (color) => {
    redInput.style.borderColor = `#${color.r.toString(16).padStart(2, '0')}0000`;
    greenInput.style.borderColor = `#00${color.g.toString(16).padStart(2, '0')}00`;
    blueInput.style.borderColor = `#0000${color.b.toString(16).padStart(2, '0')}`;

    redInput.style.color = `#FF8888`;
    greenInput.style.color = `#88FF88`;
    blueInput.style.color = `#8888FF`;
};

const updatePreview = (colorStringPair) => {
    preview.style.backgroundColor = colorStringPair.color;
    preview.style.borderColor = colorStringPair.negative;
};

const getColorFromUrl = () => {
    const url = new URL(window.location);
    const colorString = url.searchParams.get('color');
    
    if (/^([0-9A-Fa-f]{6})$/.test(colorString)) {
        return parseColorString(`#${colorString}`);
    }

    url.searchParams.delete('color');
    return null;
};

const initializeColors = () => {
    const urlColor = getColorFromUrl();

    const colorStringPair = urlColor ? assembleColorStringPair(urlColor) : getCurrentColorStringPair()
    const color = urlColor ?? parseColorString(colorStringPair.color);

    initializeInputs(color);
    updateInputColors(color);
    updatePreview(colorStringPair);
};

const assembleColorFromInputs = () => ({
    r: Number.parseInt(redInput.value, isHexMode() ? 16 : 10),
    g: Number.parseInt(greenInput.value, isHexMode() ? 16 : 10),
    b: Number.parseInt(blueInput.value, isHexMode() ? 16 : 10),
});

const updateColors = () => {
    const color = assembleColorFromInputs();
    const colorStringPair = assembleColorStringPair(color);

    updateInputColors(color);
    updatePreview(colorStringPair);
};

const uninitializeColors = () => {
    rgbInputs.forEach((input) => {
        input.style.borderColor = backgroundColorString;
        input.style.color = backgroundColorString;
    });

    preview.style.backgroundColor = backgroundColorString;
    preview.style.borderColor = backgroundColorString;
};

const convertInputsToHex = () => {
    rgbInputs.forEach((input) => {
        input.value = Number.parseInt(input.value, 10).toString(16).padStart(2, '0').toUpperCase();
    });
};

const convertInputsToDecimal = () => {
    rgbInputs.forEach((input) => {
        input.value = Number.parseInt(input.value, 16).toString(10);
    });
};

const switchHexMode = () => {
    hexSwitch.classList.toggle('active');

    if (hexSwitch.classList.contains('active')) {
        convertInputsToHex();
        return;
    }

    convertInputsToDecimal();
};

const isHexMode = () => hexSwitch.classList.contains('active');

const onColorComponentInput = (event) => {
    const isNumber = isHexMode() ? isHex : isDigit;

    if (isNumber(event.target.value)) {
        saveOldValue(event);
        return;
    }

    restoreOldValue(event);
};

const handleDecimalInput = (event) => {
    const element = event.target;
    const value = element.value;

    if (!value) {
        element.value = '0';
        saveOldValue(event);
        return;
    }

    if (Number.parseInt(value, 10) > 255) {
        element.value = '255';
        saveOldValue(event);
        return;
    }

    element.value = Number.parseInt(value, 10).toString();
    saveOldValue(event);
};

const handleHexInput = (event) => {
    const element = event.target;
    const value = element.value;

    if (!value) {
        element.value = '00';
        saveOldValue(event);
        return;
    }

    if (value.length > 2) {
        element.value = 'FF';
        saveOldValue(event);
        return;
    }

    element.value = value.toUpperCase().padStart(2, '0');
    saveOldValue(event);
};

const updateURLParameters = () => {
    const color = assembleColorFromInputs();
    const colorStringPair = assembleColorStringPair(color);

    const url = new URL(window.location);
    url.searchParams.set('color', colorStringPair.color.slice(1));
    updateUrl(url);
};

const onColorComponentFocusOut = (event) => {
    const handleInput = isHexMode() ? handleHexInput : handleDecimalInput;
    handleInput(event);
    updateColors();

    updateURLParameters();
};

const applyColor = () => {
    const color = assembleColorFromInputs();
    const colorStringPair = assembleColorStringPair(color);

    changeColor(colorStringPair);
};

const setupPage = () => {
    hexSwitch.onclick = switchHexMode;
    rgbInputs.forEach((input) => {
        input.oninput = onColorComponentInput;
        input.onfocus = saveOldValue;
        input.addEventListener('focusout', onColorComponentFocusOut);
    });
    applyButton.onclick = applyColor;

    initializeColors();
    registerCustomUnloadHandler(uninitializeColors);
};

window.onload = setupPage;
