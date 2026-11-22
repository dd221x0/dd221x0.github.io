const emailLink = document.querySelector('#email a')!;

const initializeEmail = (onClick: () => void) => {
    emailLink.addEventListener('click', onClick);
};

export { initializeEmail };
