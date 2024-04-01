import { initializeLayout } from "../layout.js";

const stringInput = document.getElementById('string');
const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

const stringToGitBranchName = (string) => string
    .replace(/[\^\[\]\(\)\>\<\"\{\}\'\|\,\?\*\!\#\$\%]/g, '')
	.replace(/\&/g, 'and')
    .replace(/\/\.+/g, '/')
	.replace(/\/+/g, '/')
	.replace(/\.{2,}/g, '.')
    .replace(/( |(\.lock)|\/|\.)+$/g, '')
	.replace(/^(\/|\.)+/g, '')
    .replace(/[ \t\:\;\~\\\@]+/g, '-')
	.replace(/\-+/g, '-');

const convertToGitBranchName = () => {
    resultTextArea.value = stringToGitBranchName(stringInput.value);
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
    initializeLayout();
    setupPage();
};
