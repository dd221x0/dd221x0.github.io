import '../layout.ts';
import {
    isDigit,
    restoreOldValue,
    saveOldValue,
    updateUrl,
} from '../common.ts';
import { md5 } from './md5.min.js';

const passwordSwitch = document.querySelector<HTMLElement>('#password')!;
const stringInput = document.querySelector<HTMLInputElement>('#string')!;
const partsCountInput = document.querySelector<HTMLInputElement>('#partsCount')!;
const partInput = document.querySelector<HTMLInputElement>('#part')!;
const resultTextArea = document.querySelector<HTMLTextAreaElement>('#result')!;
const copyButton = document.querySelector<HTMLElement>('#copy')!;

const switchPasswordMode = () => {
    passwordSwitch.classList.toggle('active');
    stringInput.type = passwordSwitch.classList.contains('active') ? 'password' : 'text';

    updateURLParameters();
};

const getHashPart = (string: string, partsCountValue: string, partValue: string) => {
    if (!string) {
        return '';
    }

    const partsCount = partsCountValue ? +partsCountValue : 1;
    const part = partValue ? +partValue : 1;

    const passwordHash = md5(string);
    const partLength = Math.floor(passwordHash.length / partsCount);
    return passwordHash.substring((part - 1) * partLength, part * partLength);
};

const updateCountRelatedInputs = (newPartsCount: string) => {
    if (newPartsCount === '') {
        partInput.value = '';
        return;
    }

    if (+newPartsCount > 32) {
        partsCountInput.value = '32';
        return;
    }

    if (+newPartsCount < +partInput.value) {
        partInput.value = partsCountInput.value;
        return;
    }
};

const handlePartsCountInput = () => {
    const newPartsCount = partsCountInput.value;

    if (!isDigit(newPartsCount)){
        restoreOldValue(partsCountInput);
        return;
    }

    updateCountRelatedInputs(newPartsCount);

    saveOldValue(partsCountInput);
    setResult();
};

const updatePartRelatedInputs = (partNumber: string) => {
    if (partsCountInput.value === '') {
        partInput.value = '';
        return;
    }

    if (+partNumber > +partsCountInput.value) {
        const partsCount = +partsCountInput.value;
        partInput.value = partsCount.toString();
    }
};

const handlePartInput = () => {
    const partNumber = partInput.value;

    if (!isDigit(partNumber)) {
        restoreOldValue(partInput);
        return;
    }

    updatePartRelatedInputs(partNumber);

    saveOldValue(partInput);
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
    const url = new URL(window.location.href);
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

const updateStringParameter = (url: URL) => {
    if (!stringInput.value || passwordSwitch.classList.contains('active')) {
        url.searchParams.delete('string');
        return
    }

    url.searchParams.set('string', stringInput.value);
};

const updatePartsCountParameter = (url: URL) => {
    if (!partsCountInput.value) {
        url.searchParams.delete('partsCount');
        return;
    }

    url.searchParams.set('partsCount', partsCountInput.value);
};

const updatePartParameter = (url: URL) => {
    if (!partInput.value) {
        url.searchParams.delete('part');
        return;
    }

    url.searchParams.set('part', partInput.value);
};

const updateURLParameters = () => {
    const url = new URL(window.location.href);

    updateStringParameter(url);
    updatePartsCountParameter(url);
    updatePartParameter(url);

    updateUrl(url);
};

const setupPage = () => {    
    passwordSwitch.onclick = switchPasswordMode;
    stringInput.oninput = setResult;
    partsCountInput.onfocus = () => saveOldValue(partsCountInput);
    partsCountInput.oninput = handlePartsCountInput;
    partInput.onfocus = () => saveOldValue(partInput);
    partInput.oninput = handlePartInput;
    copyButton.onclick = copyResult;

    applyValuesFromURL();

    stringInput.focus();
};

window.onload = () => {
    setupPage();
};
