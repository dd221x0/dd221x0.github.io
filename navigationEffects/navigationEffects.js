let navigationElements = [];

let navigationHandler = () => {};

let currentEvent = null;

const registerNavigationHandler = (handler) => {
    navigationHandler = handler;
};

const registerNavigationElements = (elements) => {
    navigationElements = [ ...navigationElements, ...elements ];
};

const handleClick = (event) => {
    if (event === currentEvent) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    navigationHandler();

    const target = event.currentTarget;

    const newEvent = new MouseEvent('click', {...event});
    currentEvent = newEvent;

    setTimeout(() => {
        target.dispatchEvent(newEvent);
    }, 1000);
};

const configureClicks = () => {
    navigationElements.forEach((el) => {
        el.addEventListener('click', handleClick);
    });
};

const initializeNavigationEffects = () => {
    configureClicks();
};

export {
    registerNavigationHandler,
    registerNavigationElements,
    initializeNavigationEffects,
};
