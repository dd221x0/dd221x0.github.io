import { getCurrentColor, placeholderColor } from "../../common.js";
import { applyColor } from "../applyColor.js";
import { md5 } from "./md5.min.js";

const passwordSwitch = document.getElementById('password');
const stringInput = document.getElementById('string');
const partsCountInput = document.getElementById('partsCount');
const partInput = document.getElementById('part');
const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

const currentColor = getCurrentColor();

let isPassword = true;

const switchPasswordMode = () => {
    isPassword = !isPassword;
    passwordSwitch.style.color = isPassword ? currentColor.color : placeholderColor;

    stringInput.type = isPassword ? 'password' : 'text';
};

const getHashPart = (string, partsCount, part) => {
    if (!string) {
        return '';
    }

    if (!partsCount) {
        partsCount = 1;
    }

    if (!part) {
        part = 1;
    }

    const passwordHash = md5(string);
    const partLength = Math.floor(passwordHash.length / partsCount);
    return passwordHash.substring((part - 1) * partLength, part * partLength);
};

const isDigit = (value) => /^\d*$/.test(value);

const saveOldValue = (event) => {
    event.target.oldValue = event.target.value;
};

const updateCountRelatedInputs = (newPartsCount) => {
    if (newPartsCount === '') {
        partInput.value = '';
        return;
    }

    if (+newPartsCount > 32) {
        partsCountInput.value = 32;
        return;
    }

    if (+newPartsCount < +partInput.value) {
        partInput.value = partsCountInput.value;
        return;
    }
};

const handlePartsCountInput = (event) => {
    const element = event.target;
    const newPartsCount = element.value;

    if (!isDigit(newPartsCount)){ 
        element.value = element.oldValue;
        return;
    }

    updateCountRelatedInputs(newPartsCount);

    saveOldValue(event);
    setResult();
};

const updatePartRelatedInputs = (partNumber) => {
    if (partsCountInput.value === '') {
        partInput.value = '';
        return;
    }

    if (+partNumber > +partsCountInput.value) {
        partInput.value = +partsCountInput.value;
        return;
    }
};

const handlePartInput = (event) => {
    const element = event.target;
    const partNumber = element.value;

    if (!isDigit(partNumber)) {
        element.value = element.oldValue;
        return;
    }

    updatePartRelatedInputs(partNumber);

    saveOldValue(event);
    setResult();
};

const setResult = () => {
    resultTextArea.value = getHashPart(stringInput.value, partsCountInput.value, partInput.value);
};

const copyResult = () => {
    resultTextArea.select();
    navigator.clipboard.writeText(resultTextArea.value);
};

const applyPageSpecificColor = () => {
    passwordSwitch.style.color = currentColor.color;
};

const setupPage = () => {    
    applyPageSpecificColor();

    passwordSwitch.onclick = switchPasswordMode;
    stringInput.oninput = setResult;
    partsCountInput.onfocus = saveOldValue;
    partsCountInput.oninput = handlePartsCountInput;
    partInput.onfocus = saveOldValue;
    partInput.oninput = handlePartInput;
    copyButton.onclick = copyResult;
};

window.onload = () => {
    applyColor();
    setupPage();
};
