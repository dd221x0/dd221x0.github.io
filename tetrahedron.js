let tetrahedron = null;
let tetrahedronParts = [];

const registerTetrahedronParts = (elements) => {
    tetrahedronParts = elements;
};

const registerTetrahedron = (element) => {
    tetrahedron = element;
};

const disassemble = () => {
    tetrahedron.classList.add('disassembled');
};

const assemble = () => {
    tetrahedron.classList.remove('disassembled');
};

const registerTriggerHoverElements = (elements) => {
    elements.forEach((el) => {
        el.addEventListener('mouseover', (event) => {
            disassemble();
            return event;
        });

        el.addEventListener('mouseout', (event) => {
            assemble();
            return event;
        });
    });
};

const initializeTetrahedron = () => {
    assemble();
};

const deinitializeTetrahedron = () => {
    disassemble();
} ;

export {
    registerTetrahedron,
    registerTetrahedronParts,
    registerTriggerHoverElements,
    initializeTetrahedron,
    deinitializeTetrahedron,
};