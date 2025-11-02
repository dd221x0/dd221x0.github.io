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
   getRemainingTime
} from './timeCalculations.js';
import { startTimer } from './timerState.js';

const url = new URL(window.location);

const timeElement = document.getElementById('time');

const endTime = new Date(1970, 0, 1, 0, 0, 0);

let maxUnit = 'year';

const inputs = createInputConfigs(endTime);

const setCountdownValue = () => {
    timeElement.innerText = getRemainingTime(endTime, inputs, maxUnit);
};

const setFinished = () => {
    const iconElement = document.createElement('i');

    iconElement.className = 'fa-solid fa-hourglass-end';
    timeElement.innerHTML = '';
    timeElement.appendChild(iconElement);
};

const correctLastDayOfMonth = () => {
    const year = endTime.getFullYear();
    const month = endTime.getMonth();
    const day = endTime.getDate();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    if (day < lastDayOfMonth) {
        return;
    }

    const dayInput = inputs.find(input => input.key === 'day');

    dayInput.element.value = lastDayOfMonth;
    dayInput.element.oldValue = lastDayOfMonth;

    endTime.setDate(lastDayOfMonth);
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
        input.onChange(input.minValue);
        url.searchParams.delete(input.key);

        return;
    }

    const newValue = getValueInsideRange(
        value,
        input.minValue,
        input.getMaxValue(endTime),
    );

    const valueString = input.key === 'year' 
        ? newValue
        : roundToTwoDigits(newValue);

    input.element.value = valueString;
    input.element.oldValue = valueString;
    input.onChange(+newValue);

    url.searchParams.set(input.key, newValue);

    if (input.needsDateCorrection) {
        correctLastDayOfMonth();
    }
};

const createFocusOutHandler = (input) => (event) => {
    setInputValue(input, event.target.value);
    updateUrl(url);
    startTimer(endTime, setCountdownValue, setFinished);
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

const setupPage = () => {
    initializeInputs();
    initializeMaxUnit();
    startTimer(endTime, setCountdownValue, setFinished);
};

window.onload = setupPage;
