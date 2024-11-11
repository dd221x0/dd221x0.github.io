let navigationElements = [];

let navigationHandler = () => {};

const registerNavigationHandler = (handler) => {
    navigationHandler = handler;
};

const registerNavigationElements = (elements) => {
    navigationElements = [ ...navigationElements, ...elements ];
};

const addNewEvent = (event, target) => {
    const newEvent = new MouseEvent('click', {...event, delayedCall: true});

    setTimeout(() => {
        target.dispatchEvent(newEvent);
    }, 1000);
};

const handleClick = (event) => {
    const target = event.currentTarget;

    if (event.delayedCall) {
        target.hasDispatchedEvent = true;
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (target.hasDispatchedEvent) {
        return;
    }

    target.hasDispatchedEvent = false;

    navigationHandler();

    addNewEvent(event, target);
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
