import "../layout.js";

const upperCaseSwitch = document.getElementById('upperCase');
const generateButton = document.getElementById('generate');
const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

const setUuidValue = (value) => {
    resultTextArea.value = upperCaseSwitch.classList.contains('active')
        ? value.toUpperCase()
        : value.toLowerCase();
};

const setNewUuid = () => {
	const uuid = crypto.randomUUID();
    setUuidValue(uuid);
};

const switchCase = () => {
    const uuid = resultTextArea.value;

    upperCaseSwitch.classList.toggle('active');
    setUuidValue(uuid);
};

const copyResult = async () => {
    resultTextArea.setSelectionRange(0, resultTextArea.value.length);
    await navigator.clipboard.writeText(resultTextArea.value);
};

const setupPage = () => {
    generateButton.onclick = setNewUuid;
    upperCaseSwitch.onclick = switchCase;
    copyButton.onclick = copyResult;

    setNewUuid();
};

window.onload = () => {
    setupPage();
};
