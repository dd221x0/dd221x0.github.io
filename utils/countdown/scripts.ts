import '../layout.ts';
import {
    isDigit,
    saveOldValue,
    restoreOldValue,
    getValueInsideRange,
    roundToTwoDigits,
    updateUrl,
} from '../common.ts';
import {
    type InputConfig,
    createInputConfigs,
    getRemainingTime,
    getPassedTime,
} from './timeCalculations.ts';
import { start } from './timerState.ts';

type Input = InputConfig & {
    element?: HTMLInputElement;
    switch?: HTMLElement | null;
};

const url = new URL(window.location.href);

const defaultTitle = 'countdown';
const title = document.querySelector<HTMLInputElement>('#title')!;

const timeElement = document.querySelector<HTMLElement>('#time')!;
const modeSwitch = document.querySelector<HTMLElement>('#modeSwitch')!;

const targetTime = new Date(0, 0, 1, 0, 0, 0);

let maxUnit = 'year';

let mode = 'countdown';

const isCountup = (newMode: string) => newMode === 'countup';

const inputs: Input[] = createInputConfigs();

const setCountdownValue = () => {
    timeElement.innerText = isCountup(mode)
        ? getPassedTime(targetTime, inputs, maxUnit)
        : getRemainingTime(targetTime, inputs, maxUnit);
};

const setInactive = () => {
    const iconElement = document.createElement('i');

    iconElement.className = `fa-solid fa-hourglass-${isCountup(mode) ? 'start' : 'end'}`;
    timeElement.innerHTML = '';
    timeElement.appendChild(iconElement);
};

const correctLastDayOfMonth = () => {
    const year = targetTime.getFullYear();
    const month = targetTime.getMonth();
    const day = targetTime.getDate();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    if (day < lastDayOfMonth) {
        return;
    }

    const dayInput = inputs.find(input => input.key === 'day')!;

    dayInput.element!.value = lastDayOfMonth.toString();
    dayInput.element!.oldValue = lastDayOfMonth.toString();

    targetTime.setDate(lastDayOfMonth);
    url.searchParams.set('day', lastDayOfMonth.toString());
};

const handleDigitInput = (input: HTMLInputElement) => {
    if (isDigit(input.value)) {
        saveOldValue(input);
        return;
    }

    restoreOldValue(input);
};

const setInputValue = (input: Input, value: string | null) => {
    if (!value) {
        input.onChange(input.minValue, targetTime);
        url.searchParams.delete(input.key);

        return;
    }

    const newValue = getValueInsideRange(
        value,
        input.minValue,
        input.getMaxValue(targetTime),
    );

    const valueString = input.key === 'year' 
        ? newValue.toString()
        : roundToTwoDigits(newValue);

    input.element!.value = valueString;
    input.element!.oldValue = valueString;
    input.onChange(+newValue, targetTime);

    url.searchParams.set(input.key, newValue.toString());

    if (input.needsDateCorrection) {
        correctLastDayOfMonth();
    }
};

const createFocusOutHandler = (input: Input) => () => {
    setInputValue(input, input.element!.value);
    updateUrl(url);
    start(targetTime, isCountup(mode), setCountdownValue, setInactive);
};

const updateSwitches = () => {
    let unitReached = false;

    inputs.forEach(input => {
        if (input.key === maxUnit) {
            unitReached = true;
        }

        if (input.switch) {
            input.switch.classList.toggle('active', unitReached);
        }
    });
};

const setMaxUnit = (key: string) => {
    maxUnit = key;
    url.searchParams.set('maxUnit', maxUnit);
    updateUrl(url);

    updateSwitches();
};

const setupSwitch = (input: Input) => {
    input.switch = document.querySelector<HTMLElement>(`#${input.key}Switch`);

    if (input.switch) {
        input.switch.onclick = () => setMaxUnit(input.key);
    }
};

const initializeInput = (input: Input) => {
    input.element = document.querySelector<HTMLInputElement>(`#${input.key}`)!;
    input.element.onfocus = () => saveOldValue(input.element!);
    input.element.oninput = () => handleDigitInput(input.element!);
    input.element.addEventListener('focusout', createFocusOutHandler(input));

    setupSwitch(input);
    setInputValue(input, url.searchParams.get(input.key));
};

const initializeInputs = () => inputs.forEach(initializeInput);

const initializeMaxUnit = () => {
    const urlMaxUnit = url.searchParams.get('maxUnit');

    if (urlMaxUnit) {
        maxUnit = urlMaxUnit;
        updateSwitches();
    }
};

const setModeSwitch = () => {
    const clockIconElement = document.createElement('i');
    clockIconElement.className = 'fa-regular fa-clock';

    const arrowIconElement = document.createElement('i');
    arrowIconElement.className = `fa-solid fa-arrow-right`;

    modeSwitch.innerHTML = '';
    if (isCountup(mode)) {
        modeSwitch.appendChild(clockIconElement);
        modeSwitch.appendChild(arrowIconElement);
        return;
    }

    modeSwitch.appendChild(arrowIconElement);
    modeSwitch.appendChild(clockIconElement);
};

const initializeSwitchMode = () => {
    const urlMode = url.searchParams.get('mode');

    if (urlMode) {
        mode = isCountup(urlMode) ? 'countup' : 'countdown';
    }

    setModeSwitch();

    modeSwitch.onclick = () => {
        mode = isCountup(mode) ? 'countdown' : 'countup';

        setModeSwitch();

        url.searchParams.set('mode', mode);
        updateUrl(url);

        start(targetTime, isCountup(mode), setCountdownValue, setInactive);
    };
};

const initializeClearView = () => {
    const isClearView = url.searchParams.get('clearView') === 'true';

    if (isClearView) {
        document.body.classList.add('clear-view');
    }
};

const updateTitleParameter = (url: URL, newTitle: string) => {
    if (!newTitle) {
        url.searchParams.delete('title');
        return;
    }

    url.searchParams.set('title', newTitle);
};

const setTitle = (newTitle: string) => {
    document.title = newTitle || defaultTitle;;

    updateTitleParameter(url, newTitle);
    updateUrl(url);
};

const initializeTitle = () => {
    const urlTitle = url.searchParams.get('title');

    if (urlTitle) {
        title.value = urlTitle;
        document.title = urlTitle;
    }

    title.addEventListener('input', () => {
        setTitle(title.value);
    });
};

const setupPage = () => {
    initializeInputs();
    initializeMaxUnit();
    initializeSwitchMode();
    initializeClearView();
    initializeTitle();
    start(targetTime, isCountup(mode), setCountdownValue, setInactive);
};

window.onload = setupPage;
