import "../layout.ts";

const upperCaseSwitch = document.querySelector<HTMLElement>('#upperCase')!;
const generateButton = document.querySelector<HTMLElement>('#generate')!;
const resultTextArea = document.querySelector<HTMLTextAreaElement>('#result')!;
const copyButton = document.querySelector<HTMLElement>('#copy')!;

const setUuidValue = (value: string) => {
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
