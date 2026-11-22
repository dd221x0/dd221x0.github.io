const utils = document.querySelector('#utils')!;
const wrench = document.querySelector('#wrench')!;

const toggleUtils = () => {
    utils.classList.toggle('expanded');
};

export const initializeUtils = () => {
    wrench.addEventListener('click', toggleUtils);
};

export const uninitializeUtils = () => {
    wrench.removeEventListener('click', toggleUtils);
};
