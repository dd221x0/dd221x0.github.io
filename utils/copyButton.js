const resultTextArea = document.getElementById('result');
const copyButton = document.getElementById('copy');

const copiedStateDuration = 2000;

let copiedStateTimeoutId = null;

const showCopiedState = () => {
    clearTimeout(copiedStateTimeoutId);
    copyButton.classList.add('copied');

    copiedStateTimeoutId = setTimeout(() => {
        copyButton.classList.remove('copied');
    }, copiedStateDuration);
};

export const copyResult = async () => {
    resultTextArea.setSelectionRange(0, resultTextArea.value.length);
    await navigator.clipboard.writeText(resultTextArea.value);
    showCopiedState();
};
