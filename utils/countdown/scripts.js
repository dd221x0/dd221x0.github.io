import '../layout.js';
import {
    isDigit,
    saveOldValue,
    getValueInsideRange,
    roundToTwoDigits,
    updateUrl,
} from '../common.js';
import {
    createInputConfigs,
    getRemainingTime,
    getPassedTime,
} from './timeCalculations.js';
import { start } from './timerState.js';

const url = new URL(window.location);

const timeElement = document.getElementById('time');
const modeSwitch = document.getElementById('modeSwitch');

const targetTime = new Date(0, 0, 1, 0, 0, 0);

let maxUnit = 'year';

let mode = 'countdown';

const isCountup = (newMode) => newMode === 'countup';

const inputs = createInputConfigs();

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

    const dayInput = inputs.find(input => input.key === 'day');

    dayInput.element.value = lastDayOfMonth;
    dayInput.element.oldValue = lastDayOfMonth;

    targetTime.setDate(lastDayOfMonth);
    url.searchParams.set('day', lastDayOfMonth);
};

const handleDigitInput = (event) => {
    if (isDigit(event.target.value)) {
        saveOldValue(event);
        return;
    }

    event.target.value = event.target.oldValue;
};

const setInputValue = (input, value) => {
    if (!value && value !== 0) {
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
        ? newValue
        : roundToTwoDigits(newValue);

    input.element.value = valueString;
    input.element.oldValue = valueString;
    input.onChange(+newValue, targetTime);

    url.searchParams.set(input.key, newValue);

    if (input.needsDateCorrection) {
        correctLastDayOfMonth();
    }
};

const createFocusOutHandler = (input) => (event) => {
    setInputValue(input, event.target.value);
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

const setMaxUnit = (key) => {
    maxUnit = key;
    url.searchParams.set('maxUnit', maxUnit);
    updateUrl(url);

    updateSwitches();
};

const setupSwitch = (input) => {
    input.switch = document.getElementById(`${input.key}Switch`);

    if (input.switch) {
        input.switch.onclick = () => setMaxUnit(input.key);
    }
};

const initializeInput = (input) => {
    input.element = document.getElementById(input.key);
    input.element.onfocus = saveOldValue;
    input.element.oninput = handleDigitInput;
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
}

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

const setupPage = () => {
    initializeInputs();
    initializeMaxUnit();
    initializeSwitchMode();
    start(targetTime, isCountup(mode), setCountdownValue, setInactive);
};

window.onload = setupPage;
