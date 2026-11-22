declare global {
    interface HTMLInputElement {
        oldValue?: string;
    }
}

export const isDigit = (value: string) => /^\d*$/.test(value);
export const isHex = (value: string) => /^[0-9A-Fa-f]*$/.test(value);

export const getValueInsideRange = (value: string, min: number, max: number) => {
    return Math.min(
        Math.max(+value, +min),
        +max
    );
};

export const saveOldValue = (input: HTMLInputElement) => {
    input.oldValue = input.value;
};

export const restoreOldValue = (input: HTMLInputElement) => {
    input.value = input.oldValue ?? '';
};

export const hasValueChanged = (input: HTMLInputElement) => input.value !== input.oldValue;

export const roundToTwoDigits = (value: number) => `${value}`.length < 2
    ? `0${value}`
    : `${value}`;

export const updateUrl = (url: URL) => {
    window.history.replaceState({}, '', url);
};