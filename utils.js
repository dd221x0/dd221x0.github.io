const utils = document.getElementById('utils');
const utilsHeader = utils.getElementsByTagName('h3')[0];

const toggleUtils = () => {
    utils.classList.toggle('expanded');
};

export const initializeUtils = () => {
    utilsHeader.addEventListener('click', toggleUtils);
};

export const uninitializeUtils = () => {
    utilsHeader.removeEventListener('click', toggleUtils);
};
