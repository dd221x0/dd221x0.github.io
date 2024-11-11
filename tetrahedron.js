let tetrahedron = null;
let triggerHoverElements = [];

const registerTetrahedron = (element) => {
    tetrahedron = element;
};

const registerTriggerHoverElements = (elements) => {
    triggerHoverElements = elements;
};

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
    triggerHoverElements.forEach((el) => {
        el.addEventListener('mouseover', handleTriggerMouseOver);
        el.addEventListener('mouseout', handleTriggerMouseOut);
    });
};

const removeTriggersHover = () => {
    triggerHoverElements.forEach((el) => {
        el.removeEventListener('mouseover', handleTriggerMouseOver);
        el.removeEventListener('mouseout', handleTriggerMouseOut);
    });
};

const initializeTetrahedron = () => {
    configureTriggersHover();
    transformFromOctahedron();
    assemble();
};

const deinitializeTetrahedron = (transform = false) => {
    removeTriggersHover();

    if (transform) {
        transformToOctahedron();
        return;
    }

    disassemble();
    return;
};

export {
    registerTetrahedron,
    registerTriggerHoverElements,
    initializeTetrahedron,
    deinitializeTetrahedron,
};