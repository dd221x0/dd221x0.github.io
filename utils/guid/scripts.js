import "../layout.js";
import { generateGuid } from "./guid.js";

const upperCaseSwitch = document.getElementById('upperCase');
const generateButton = document.getElementById('generate');
const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

const setGuidValue = (value) => {
    resultTextArea.value = upperCaseSwitch.classList.contains('active')
        ? value.toUpperCase()
        : value.toLowerCase();
};

const setNewGuid = () => {
	const guid = generateGuid();
    setGuidValue(guid);
};

const switchCase = () => {
    const guid = resultTextArea.value;

    upperCaseSwitch.classList.toggle('active');
    setGuidValue(guid);
};

const copyResult = async () => {
    resultTextArea.setSelectionRange(0, resultTextArea.value.length);
    await navigator.clipboard.writeText(resultTextArea.value);
};

const setupPage = () => {
    generateButton.onclick = setNewGuid;
    upperCaseSwitch.onclick = switchCase;
    copyButton.onclick = copyResult;

    setNewGuid();
};

window.onload = () => {
    setupPage();
};
