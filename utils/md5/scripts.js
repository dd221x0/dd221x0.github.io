import { registerLayoutElements } from '../layout.js';
import { md5 } from './md5.min.js';
import { registerTargetSwitchElements } from '../../colorChange/colorChange.js';

const passwordSwitch = document.getElementById('password');
const stringInput = document.getElementById('string');
const partsCountInput = document.getElementById('partsCount');
const partInput = document.getElementById('part');
const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

const switchPasswordMode = () => {
    passwordSwitch.isActive = !passwordSwitch.isActive;
    stringInput.type = passwordSwitch.isActive ? 'password' : 'text';

    updateURLParameters();
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
    updateURLParameters();
};

const copyResult = async () => {
    resultTextArea.setSelectionRange(0, resultTextArea.value.length);
    await navigator.clipboard.writeText(resultTextArea.value);
};

const readURLParameters = () => {
    const url = new URL(window.location);
    const string = url.searchParams.get('string');
    const partsCount = url.searchParams.get('partsCount');
    const part = url.searchParams.get('part');

    if (string) {
        stringInput.value = string;
    }

    if (!partsCount) {
        return
    }

    partsCountInput.value = partsCount;

    if (part) {
        partInput.value = part;
    }
};

const applyValuesFromURL = () => {
    readURLParameters();
    setResult();
};

const updateStringParameter = (url) => {
    if (!stringInput.value || passwordSwitch.isActive) {
        url.searchParams.delete('string');
        return
    }

    url.searchParams.set('string', stringInput.value);
};

const updatePartsCountParameter = (url) => {
    if (!partsCountInput.value) {
        url.searchParams.delete('partsCount');
        return;
    }

    url.searchParams.set('partsCount', partsCountInput.value);
};

const updatePartParameter = (url) => {
    if (!partInput.value) {
        url.searchParams.delete('part');
        return;
    }

    url.searchParams.set('part', partInput.value);
};

const updateURLParameters = () => {
    const url = new URL(window.location);

    updateStringParameter(url);
    updatePartsCountParameter(url);
    updatePartParameter(url);

    window.history.replaceState({}, '', url);
};

const setupPage = () => {    
    passwordSwitch.onclick = switchPasswordMode;
    stringInput.oninput = setResult;
    partsCountInput.onfocus = saveOldValue;
    partsCountInput.oninput = handlePartsCountInput;
    partInput.onfocus = saveOldValue;
    partInput.oninput = handlePartInput;
    copyButton.onclick = copyResult;

    applyValuesFromURL();

    stringInput.focus();
};

window.onload = () => {
    setupPage();
    registerTargetSwitchElements([passwordSwitch]);
    registerLayoutElements();
};
