import { registerCustomUnloadHandler } from '../layout.ts';
import {
    saveOldValue,
    restoreOldValue,
    isHex,
    isDigit,
    updateUrl,
} from '../common.ts';
import {
    type Rgb,
    getCurrentRgb,
    rgbComponentToHex,
    rgbToColorString,
    colorStringToRgb,
    inverseColorString,
    backgroundColorString,
} from '../../colorChange/common.ts';
import { changeColor } from '../../colorChange/colorChange.ts';

const hexSwitch = document.querySelector<HTMLElement>('#hex')!;
const redInput = document.querySelector<HTMLInputElement>('#red')!;
const greenInput = document.querySelector<HTMLInputElement>('#green')!;
const blueInput = document.querySelector<HTMLInputElement>('#blue')!;
const preview = document.querySelector<HTMLElement>('#preview')!;
const applyButton = document.querySelector<HTMLElement>('#apply')!;

const rgbInputs = [redInput, greenInput, blueInput];

const initializeInputs = (rgb: Rgb) => {
    redInput.value = rgbComponentToHex(rgb.r);
    greenInput.value = rgbComponentToHex(rgb.g);
    blueInput.value = rgbComponentToHex(rgb.b);
};

const updateInputColors = (rgb: Rgb) => {
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

const updatePreview = (rgb: Rgb) => {
    const colorString = rgbToColorString(rgb);
    const negativeColorString = inverseColorString(colorString);

    preview.style.backgroundColor = colorString;
    preview.style.borderColor = negativeColorString;
};

const getRgbFromUrl = () => {
    const url = new URL(window.location.href);
    const colorString = url.searchParams.get('color');
    
    if (colorString && /^([0-9A-Fa-f]{6})$/.test(colorString)) {
        return colorStringToRgb(`#${colorString}`);
    }

    url.searchParams.delete('color');
    return null;
};

const initializeColors = () => {
    const urlRgb = getRgbFromUrl();
    const currentRgb = getCurrentRgb();
    const rgb = urlRgb ?? currentRgb;

    initializeInputs(rgb);
    updateInputColors(rgb);
    updatePreview(rgb);
};

const assembleRgbFromInputs = (): Rgb => ({
    r: Number.parseInt(redInput.value, isHexMode() ? 16 : 10),
    g: Number.parseInt(greenInput.value, isHexMode() ? 16 : 10),
    b: Number.parseInt(blueInput.value, isHexMode() ? 16 : 10),
});

const updateColors = () => {
    const rgb = assembleRgbFromInputs();

    updateInputColors(rgb);
    updatePreview(rgb);
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

const onColorComponentInput = (input: HTMLInputElement) => {
    const isNumber = isHexMode() ? isHex : isDigit;

    if (isNumber(input.value)) {
        saveOldValue(input);
        return;
    }

    restoreOldValue(input);
};

const handleDecimalInput = (input: HTMLInputElement) => {
    const value = input.value;

    if (!value) {
        input.value = '0';
        saveOldValue(input);
        return;
    }

    if (Number.parseInt(value, 10) > 255) {
        input.value = '255';
        saveOldValue(input);
        return;
    }

    input.value = Number.parseInt(value, 10).toString();
    saveOldValue(input);
};

const handleHexInput = (input: HTMLInputElement) => {
    const value = input.value;

    if (!value) {
        input.value = '00';
        saveOldValue(input);
        return;
    }

    if (Number.parseInt(value, 16) > 255) {
        input.value = 'FF';
        saveOldValue(input);
        return;
    }

    const component = Number.parseInt(value, 16);
    input.value = rgbComponentToHex(component);
    saveOldValue(input);
};

const updateURLParameters = () => {
    const rgb = assembleRgbFromInputs();
    const colorString = rgbToColorString(rgb);

    const url = new URL(window.location.href);
    url.searchParams.set('color', colorString.slice(1));
    updateUrl(url);
};

const onColorComponentFocusOut = (input: HTMLInputElement) => {
    const handleInput = isHexMode() ? handleHexInput : handleDecimalInput;
    handleInput(input);
    updateColors();

    updateURLParameters();
};

const applyColor = () => {
    const rgb = assembleRgbFromInputs();
    const colorString = rgbToColorString(rgb);

    changeColor(colorString);
};

const setupPage = () => {
    hexSwitch.onclick = switchHexMode;
    rgbInputs.forEach((input) => {
        input.oninput = () => onColorComponentInput(input);
        input.onfocus = () => saveOldValue(input);
        input.addEventListener('focusout', () => onColorComponentFocusOut(input));
    });
    applyButton.onclick = applyColor;

    initializeColors();
    registerCustomUnloadHandler(uninitializeColors);
};

window.onload = setupPage;
