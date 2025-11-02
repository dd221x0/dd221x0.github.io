const tetrahedron = document.querySelector('#tetrahedron');
const hoverTriggerElements = [...document.getElementsByClassName('hoverTrigger')];

const disassemble = () => {
    tetrahedron.classList.add('disassembled');
};

const assemble = () => {
    tetrahedron.classList.remove('disassembled');
};

const transformToOctahedron = () => {
    tetrahedron.classList.add('octahedron');
};

const transformFromOctahedron = () => {
    tetrahedron.classList.remove('octahedron');
};

const handleTriggerMouseOver = (event) => {
    disassemble();
    return event;
};

const handleTriggerMouseOut = (event) => {
    assemble();
    return event;
};

const configureTriggersHover = () => {
    hoverTriggerElements.forEach((el) => {
        el.addEventListener('mouseover', handleTriggerMouseOver);
        el.addEventListener('mouseout', handleTriggerMouseOut);
    });
};

const removeTriggersHover = () => {
    hoverTriggerElements.forEach((el) => {
        el.removeEventListener('mouseover', handleTriggerMouseOver);
        el.removeEventListener('mouseout', handleTriggerMouseOut);
    });
};

const initializeTetrahedron = () => {
    configureTriggersHover();
    transformFromOctahedron();
    assemble();
};

const uninitializeTetrahedron = (transform = false) => {
    removeTriggersHover();

    if (transform) {
        transformToOctahedron();
        return;
    }

    disassemble();
    return;
};

export {
    initializeTetrahedron,
    uninitializeTetrahedron,
};