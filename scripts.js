import {
    setColor,
    setBorderColor,
    setHoverColorChange,
    setClickColorChange,
    setDoubleClickColorChange,
} from './colorChange.js';

const tetrahedronParts = document.querySelectorAll('#tetrahedron div');
const socialLinks = document.querySelectorAll('#social a');
const email = document.querySelector('#email a');
const utilsHeader = document.querySelector('#utils h3');
const utilsLinks = document.querySelectorAll('#utils a');

const controls = [
    ...socialLinks,
    ...utilsLinks,
    email,
];

const allElements = [
    ...controls,
    utilsHeader,
];

const setCursor = (element) => {
    element.style.cursor = 'pointer';
};

const initializeTetrahedron = () => {
    tetrahedronParts.forEach((element) => {
        setClickColorChange(element, allElements, tetrahedronParts);
        setDoubleClickColorChange(element, allElements, tetrahedronParts);
        setCursor(element);
    });
};

const initialize = () => {
    initializeTetrahedron();
    setColor(allElements);
    setBorderColor(tetrahedronParts);
    setHoverColorChange(controls);
}

window.onload = () => {
    initialize();
};
