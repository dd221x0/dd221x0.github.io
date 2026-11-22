const navigationElements = document.querySelectorAll<HTMLElement>('.navigator');

let navigationHandler = () => {};

let currentEvent: MouseEvent | null = null;

const registerNavigationHandler = (handler: () => void) => {
    navigationHandler = handler;
};

const handleClick = (event: MouseEvent) => {
    if (event === currentEvent) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    navigationHandler();

    const target = event.currentTarget!;

    const newEvent = new MouseEvent('click', {...event});
    currentEvent = newEvent;

    setTimeout(() => {
        target.dispatchEvent(newEvent);
    }, 1000);
};

const configureClickHandlers = () => {
    navigationElements.forEach((el) => {
        el.addEventListener('click', handleClick);
    });
};

const removeClickHandlers = () => {
    navigationElements.forEach((el) => {
        el.removeEventListener('click', handleClick);
    });
};

const initializeNavigationEffects = () => {
    configureClickHandlers();
};

const uninitializeNavigationEffects = () => {
    removeClickHandlers();
};

export {
    registerNavigationHandler,
    initializeNavigationEffects,
    uninitializeNavigationEffects,
};
