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
    rgbComponentToHex,
    rgbToColorString,
    colorStringToRgb,
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

const initializeInputs = (rgb) => {
    redInput.value = rgbComponentToHex(rgb.r);
    greenInput.value = rgbComponentToHex(rgb.g);
    blueInput.value = rgbComponentToHex(rgb.b);
};

const updateInputColors = (rgb) => {
    const redRgb = {r: rgb.r, g: 0, b: 0};
    const greenRgb = {r: 0, g: rgb.g, b: 0};
    const blueRgb = {r: 0, g: 0, b: rgb.b};

    redInput.style.borderColor = rgbToColorString(redRgb);
    greenInput.style.borderColor = rgbToColorString(greenRgb);
    blueInput.style.borderColor = rgbToColorString(blueRgb);

    redInput.style.color = `#FF8888`;
    greenInput.style.color = `#88FF88`;
    blueInput.style.color = `#8888FF`;
};

const updatePreview = (colorStringPair) => {
    preview.style.backgroundColor = colorStringPair.color;
    preview.style.borderColor = colorStringPair.negative;
};

const getRgbFromUrl = () => {
    const url = new URL(window.location);
    const colorString = url.searchParams.get('color');
    
    if (/^([0-9A-Fa-f]{6})$/.test(colorString)) {
        return colorStringToRgb(`#${colorString}`);
    }

    url.searchParams.delete('color');
    return null;
};

const initializeColors = () => {
    const urlRgb = getRgbFromUrl();

    const colorStringPair = urlRgb ? assembleColorStringPair(urlRgb) : getCurrentColorStringPair()
    const rgb = urlRgb ?? colorStringToRgb(colorStringPair.color);

    initializeInputs(rgb);
    updateInputColors(rgb);
    updatePreview(colorStringPair);
};

const assembleRgbFromInputs = () => ({
    r: Number.parseInt(redInput.value, isHexMode() ? 16 : 10),
    g: Number.parseInt(greenInput.value, isHexMode() ? 16 : 10),
    b: Number.parseInt(blueInput.value, isHexMode() ? 16 : 10),
});

const updateColors = () => {
    const rgb = assembleRgbFromInputs();
    const colorStringPair = assembleColorStringPair(rgb);

    updateInputColors(rgb);
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
        const component = Number.parseInt(input.value, 10);
        input.value = rgbComponentToHex(component);
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

    if (Number.parseInt(value, 16) > 255) {
        element.value = 'FF';
        saveOldValue(event);
        return;
    }

    const component = Number.parseInt(value, 16);
    element.value = rgbComponentToHex(component);
    saveOldValue(event);
};

const updateURLParameters = () => {
    const rgb = assembleRgbFromInputs();
    const colorString = rgbToColorString(rgb);

    const url = new URL(window.location);
    url.searchParams.set('color', colorString.slice(1));
    updateUrl(url);
};

const onColorComponentFocusOut = (event) => {
    const handleInput = isHexMode() ? handleHexInput : handleDecimalInput;
    handleInput(event);
    updateColors();

    updateURLParameters();
};

const applyColor = () => {
    const rgb = assembleRgbFromInputs();

    changeColor(rgb);
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
