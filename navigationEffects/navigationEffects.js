let navigationElements = [];

let navigationHandler = () => {};

const registerNavigationHandler = (handler) => {
    navigationHandler = handler;
};

const registerNavigationElements = (elements) => {
    navigationElements = [ ...navigationElements, ...elements ];
};

const handleClick = (event) => {
    if (event.delayedCall) {
        return event;
    }

    event.preventDefault();
    event.stopPropagation();

    navigationHandler();

    const newEvent = new MouseEvent('click', {...event, delayedCall: true});
    const target = event.currentTarget

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
