import { copyText } from '../copyButton/copyButton.js';

const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

export const updateCopyButtonVisibility = () => {
    const isResultEmpty = !resultTextArea.value;
    copyButton.classList.toggle('empty', isResultEmpty);
};

export const copyResult = async () => {
    resultTextArea.setSelectionRange(0, resultTextArea.value.length);
    await copyText(resultTextArea.value);
};
