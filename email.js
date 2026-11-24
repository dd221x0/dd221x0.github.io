const email = document.querySelector('#email');
const envelope = document.querySelector('#envelope');
const address = document.querySelector('#address a');
const copyButton = document.querySelector('#copy');

const copiedStateDuration = 2000;

let copiedStateTimeoutId = null;

const toggleEmail = () => {
    email.classList.toggle('expanded');
};

const showCopiedState = () => {
    clearTimeout(copiedStateTimeoutId);
    copyButton.classList.add('copied');

    copiedStateTimeoutId = setTimeout(() => {
        copyButton.classList.remove('copied');
    }, copiedStateDuration);
};

const copyAddress = async () => {
    await navigator.clipboard.writeText(address.textContent);
    showCopiedState();
};

export const initializeEmail = () => {
    envelope.addEventListener('click', toggleEmail);
    copyButton.addEventListener('click', copyAddress);
};

export const uninitializeEmail = () => {
    envelope.removeEventListener('click', toggleEmail);
    copyButton.removeEventListener('click', copyAddress);
};
