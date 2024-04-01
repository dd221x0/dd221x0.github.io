import { registerTargetSwitchElements } from "../../colorChange/colorChange.js";
import { initializeLayout } from "../layout.js";
import { guid } from "./guid.js";

const upperCaseSwitch = document.getElementById('upperCase');
const generateButton = document.getElementById('generate');
const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

let isUpperCase = false;

const setGuidValue = () => {
    resultTextArea.value = isUpperCase ? guid().toUpperCase() : guid();
};

const switchCase = () => {
    const guid = resultTextArea.value;

    isUpperCase = !isUpperCase;
    upperCaseSwitch.isActive = isUpperCase;
    resultTextArea.value = isUpperCase ? guid.toUpperCase() : guid.toLowerCase();
};

const copyResult = () => {
    resultTextArea.select();
    navigator.clipboard.writeText(resultTextArea.value);
};

const setupPage = () => {
    upperCaseSwitch.isActive = isUpperCase;

    generateButton.onclick = setGuidValue;
    upperCaseSwitch.onclick = switchCase;
    copyButton.onclick = copyResult;

    setGuidValue();
};

window.onload = () => {
    setupPage();
	registerTargetSwitchElements([upperCaseSwitch]);
    initializeLayout();
};
