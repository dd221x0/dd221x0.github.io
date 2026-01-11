export const isDigit = (value) => /^\d*$/.test(value);

export const getValueInsideRange = (value, min, max) => {
    return Math.min(
        Math.max(+value, +min),
        +max
    );
};

export const saveOldValue = (event) => {
    event.target.oldValue = event.target.value;
};

export const restoreOldValue = (event) => {
    event.target.value = event.target.oldValue;
};

export const roundToTwoDigits = (value) => `${value}`.length < 2
    ? `0${value}`
    : `${value}`;

export const updateUrl = (url) => {
    window.history.replaceState({}, '', url);
};