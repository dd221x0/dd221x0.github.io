import { getCurrentColor, placeholderColor } from "../../common.js";
import { applyColor } from "../applyColor.js";
import { guid } from "./guid.js";

const upperCaseSwitch = document.getElementById('upperCase');
const generateButton = document.getElementById('generate');
const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

const currentColor = getCurrentColor();

let isUpperCase = false;

const setGuidValue = () => {
    resultTextArea.value = isUpperCase ? guid().toUpperCase() : guid();
};

const switchCase = () => {
    const guid = resultTextArea.value;

    isUpperCase = !isUpperCase;
    upperCaseSwitch.style.color = isUpperCase ? currentColor.color : placeholderColor;
    resultTextArea.value = isUpperCase ? guid.toUpperCase() : guid.toLowerCase();
};

const copyResult = () => {
    resultTextArea.select();
    navigator.clipboard.writeText(resultTextArea.value);
};

const setupPage = () => {
    upperCaseSwitch.style.color = placeholderColor;

    generateButton.onclick = setGuidValue;
    upperCaseSwitch.onclick = switchCase;
    copyButton.onclick = copyResult;

    setGuidValue();
};

window.onload = () => {
    applyColor();
    setupPage();
};
