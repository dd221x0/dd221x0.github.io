import '../layout.ts';
import {
    saveOldValue,
    restoreOldValue,
    hasValueChanged,
    isDigit,
} from '../common.ts';

const specialCharactersInput = document.querySelector<HTMLInputElement>('#specialCharacters')!;
const lengthInput = document.querySelector<HTMLInputElement>('#length')!;
const generateButton = document.querySelector<HTMLElement>('#generate')!;
const resultTextArea = document.querySelector<HTMLTextAreaElement>('#result')!;
const copyButton = document.querySelector<HTMLElement>('#copy')!;

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

const generatePassword = (passwordLength: number) => {
    const symbolSets = getSymbolsSets();
    const allSymbols = symbolSets.join('');

    const passwordSymbols = [];

    const randomGenerateIndexes = Array.from(
        crypto.getRandomValues(new Uint32Array(passwordLength))
    );

    for (let symbolSet of symbolSets) {
        const randomIndex = randomGenerateIndexes.shift()! % symbolSet.length;
        passwordSymbols.push(symbolSet[randomIndex]);
    }

    for (let i = passwordLength - passwordSymbols.length; i > 0; i--) {
        const randomIndex = randomGenerateIndexes.shift()! % allSymbols.length;
        passwordSymbols.push(allSymbols[randomIndex]);
    }

    let password = '';
    const randomShuffleIndexes = Array.from(
        crypto.getRandomValues(new Uint32Array(passwordLength))
    );

    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = randomShuffleIndexes.shift()! % passwordSymbols.length;
        password += passwordSymbols[randomIndex];
        passwordSymbols.splice(randomIndex, 1);
    }

    return password;
};

const handleSpecialCharactersFocusOut = () => {
    if (!hasValueChanged(specialCharactersInput)) {
        return;
    }

    saveOldValue(specialCharactersInput);
    setNewPassword();
};

const handleLengthInput = () => {
    if (isDigit(lengthInput.value)) {
        saveOldValue(lengthInput);
        return;
    }

    restoreOldValue(lengthInput);
};

const handleLengthFocusOut = () => {
    const newValue = lengthInput.value;

    if (+newValue < 8 && newValue !== '') {
        lengthInput.value = '8';
    }

    if (+newValue > 32) {
        lengthInput.value = '32';
    }

    const isSameLength = resultTextArea.value.length === +lengthInput.value;
    const isDefaultLength = lengthInput.value === '' && resultTextArea.value.length === defaultLength;

    if (isSameLength || isDefaultLength) {
        return;
    }

    setNewPassword();
};

const setNewPassword = () => {
    const password = generatePassword(+lengthInput.value || defaultLength);
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
    lengthInput.onfocus = () => saveOldValue(lengthInput);
    lengthInput.oninput = handleLengthInput;
    lengthInput.addEventListener('focusout', handleLengthFocusOut);
    generateButton.onclick = setNewPassword;
    copyButton.onclick = copyResult;

    setNewPassword();
};

window.onload = () => {
    setupPage();
};
