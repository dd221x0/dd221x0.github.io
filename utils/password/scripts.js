import '../layout.js';
import {
    saveOldValue,
    restoreOldValue,
    hasValueChanged,
    isDigit,
} from '../common.js';

const specialCharactersInput = document.getElementById('specialCharacters');
const lengthInput = document.getElementById('length');
const generateButton = document.getElementById('generate');
const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const digits = '0123456789';

const defaultSpecialCharacters = '"`!@#$%^&*()_+-={}[]:;\',.<>?';
const defaultLength = 16;

const getSymbolsSets = () => {
    const symbolSets = [
        lowerCaseLetters,
        upperCaseLetters,
        digits,
    ];

    if (specialCharactersInput.value?.length) {
        symbolSets.push(specialCharactersInput.value);
    }

    return symbolSets;
}

const generatePassword = (passwordLength) => {
    const symbolSets = getSymbolsSets();
    const allSymbols = symbolSets.join('');

    const passwordSymbols = [];

    for (let symbolSet of symbolSets) {
        const randomIndex = Math.floor(Math.random() * symbolSet.length);
        passwordSymbols.push(symbolSet[randomIndex]);
    }

    for (let i = passwordLength - passwordSymbols.length; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * allSymbols.length);
        passwordSymbols.push(allSymbols[randomIndex]);
    }

    let password = '';

    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * passwordSymbols.length);
        password += passwordSymbols[randomIndex];
        passwordSymbols.splice(randomIndex, 1);
    }

    return password;
};

const handleSpecialCharactersFocusOut = (event) => {
    if (!hasValueChanged(event)) {
        return;
    }

    saveOldValue(event);
    setNewPassword();
};

const handleLengthInput = (event) => {
    if (isDigit(event.target.value)) {
        saveOldValue(event);
        return;
    }

    restoreOldValue(event);
};

const handleLengthFocusOut = (event) => {
    const element = event.target;
    const newValue = element.value;

    if (+newValue < 8 && newValue !== '') {
        element.value = 8;
    }

    if (+newValue > 32) {
        element.value = 32;
    }

    const isSameLength = resultTextArea.value.length === +element.value;
    const isDefaultLength = element.value === '' && resultTextArea.value.length === defaultLength;

    if (isSameLength || isDefaultLength) {
        return;
    }

    setNewPassword(+element.value);
};

const setNewPassword = () => {
    const password = generatePassword(lengthInput.value || defaultLength);
    resultTextArea.value = password;
};

const copyResult = async () => {
    resultTextArea.setSelectionRange(0, resultTextArea.value.length);
    await navigator.clipboard.writeText(resultTextArea.value);
};

const setupPage = () => {
    specialCharactersInput.value = defaultSpecialCharacters;
    specialCharactersInput.oldValue = defaultSpecialCharacters;
    specialCharactersInput.addEventListener('focusout', handleSpecialCharactersFocusOut);
    lengthInput.onfocus = saveOldValue;
    lengthInput.oninput = handleLengthInput;
    lengthInput.addEventListener('focusout', handleLengthFocusOut);
    generateButton.onclick = setNewPassword;
    copyButton.onclick = copyResult;

    setNewPassword(lengthInput.value);
};

window.onload = () => {
    setupPage();
};
