const copyButton = document.querySelector('#copy');

const copiedStateDuration = 2000;

let copiedStateTimeoutId = null;

const showCopiedState = () => {
    clearTimeout(copiedStateTimeoutId);
    copyButton.classList.add('copied');

    copiedStateTimeoutId = setTimeout(() => {
        copyButton.classList.remove('copied');
    }, copiedStateDuration);
};

export const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
    showCopiedState();
};
