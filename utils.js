const utils = document.getElementById('utils');
const wrench = document.getElementById('wrench');

const toggleUtils = () => {
    utils.classList.toggle('expanded');
};

export const initializeUtils = () => {
    wrench.addEventListener('click', toggleUtils);
};

export const uninitializeUtils = () => {
    wrench.removeEventListener('click', toggleUtils);
};
