import { copyText } from './copyButton/copyButton.js';

const email = document.querySelector('#email');
const envelope = document.querySelector('#envelope');
const address = document.querySelector('#address a');
const copyButton = document.querySelector('#copy');

const toggleEmail = () => {
    email.classList.toggle('expanded');
};

const copyAddress = async () => {
    await copyText(address.textContent);
};

export const initializeEmail = () => {
    envelope.addEventListener('click', toggleEmail);
    copyButton.addEventListener('click', copyAddress);
};

export const uninitializeEmail = () => {
    envelope.removeEventListener('click', toggleEmail);
    copyButton.removeEventListener('click', copyAddress);
};
