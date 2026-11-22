import '../layout.ts';
import { updateUrl } from '../common.ts';

const stringInput = document.querySelector<HTMLInputElement>('#string')!;
const resultTextArea = document.querySelector<HTMLTextAreaElement>('#result')!;
const copyButton = document.querySelector<HTMLElement>('#copy')!;

const stringToGitBranchName = (string: string) => string
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
    updateURLParameters();
};

const copyResult = async () => {
    resultTextArea.setSelectionRange(0, resultTextArea.value.length);
    await navigator.clipboard.writeText(resultTextArea.value);
};

const updateStringParameter = (url: URL) => {
    if (!stringInput.value) {
        url.searchParams.delete('string');
        return;
    }

    url.searchParams.set('string', stringInput.value);
};

const updateURLParameters = () => {
    const url = new URL(window.location.href);
    
    updateStringParameter(url);

    updateUrl(url);
};

const readURLParameters = () => {
    const url = new URL(window.location.href);
    const string = url.searchParams.get('string');

    if (string) {
        stringInput.value = string;
    }
};

const applyValuesFromURL = () => {
    readURLParameters();
    convertToGitBranchName();
};

const setupPage = () => {
    stringInput.oninput = convertToGitBranchName;
    copyButton.onclick = copyResult;

    applyValuesFromURL();

    stringInput.focus();
};

window.onload = () => {
    setupPage();
};
