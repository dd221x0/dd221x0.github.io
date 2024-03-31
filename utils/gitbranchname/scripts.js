import { applyColor } from "../applyColor.js";

const stringInput = document.getElementById('string');
const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

const stingToGitBranchName = (string) => string
    .replace(/[\~\^:\[\]\(\)\\]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/\/\.+/g, '/')
    .replace(/( |(\.lock)|\/)+$/g, '')
    .replace(/[ \t]+/g, '-');

const convertToGitBranchName = () => {
    resultTextArea.value = stingToGitBranchName(stringInput.value);
};

const copyResult = () => {
    resultTextArea.select();
    navigator.clipboard.writeText(resultTextArea.value);
};

const setupPage = () => {
    stringInput.oninput = convertToGitBranchName;
    copyButton.onclick = copyResult;
};

window.onload = () => {
    applyColor();
    setupPage();
};
