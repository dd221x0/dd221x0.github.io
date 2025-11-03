import { roundToTwoDigits } from '../common.js';

export const createInputConfigs = () => [
    {
        key: 'year',
        onChange: (value, targetTime) => { targetTime.setFullYear(+value); },
        needsDateCorrection: true,
        getMaxValue: () => 9999,
        minValue: 1970,
        getDifference: (now, end) => end.getFullYear() - now.getFullYear(),
        convertToUnit: (now, end) => {
            const monthDifference = new Date(
                0,
                now.getMonth(),
                now.getDate(),
                now.getHours(),
                now.getMinutes(),
                now.getSeconds()
            ) > new Date(
                0,
                end.getMonth(),
                end.getDate(),
                end.getHours(),
                end.getMinutes(),
                end.getSeconds()
            ) ? 1 : 0;

            return end.getFullYear() - now.getFullYear() - monthDifference;
        }
    },
    {
        key: 'month',
        onChange: (value, targetTime) => { targetTime.setMonth(+value - 1); },
        needsDateCorrection: true,
        getMaxValue: () => 12,
        minValue: 1,
        getDifference: (now, end) => end.getMonth() - now.getMonth(),
        convertToUnit: (now, end) => {
            const dateDifference = new Date(
                0,
                0,
                now.getDate(),
                now.getHours(),
                now.getMinutes(),
                now.getSeconds(),
            ) > new Date(
                0,
                0,
                end.getDate(),
                end.getHours(),
                end.getMinutes(),
                end.getSeconds(),
            ) ? 1 : 0;

            return end.getMonth() - now.getMonth()
                + (end.getFullYear() - now.getFullYear()) * 12
                - dateDifference;
        },
    },
    {
        key: 'day',
        onChange: (value, targetTime) => { targetTime.setDate(+value); },
        getMaxValue: (time) => {
            const year = time.getFullYear();
            const month = time.getMonth();
            return new Date(year, month + 1, 0).getDate();
        },
        minValue: 1,
        getDifference: (now, end) => end.getDate() - now.getDate(),
        convertToUnit: (now, end) => Math.floor((end - now) / 1000 / 60 / 60 / 24),
    },
    {
        key: 'hour',
        onChange: (value, targetTime) => { targetTime.setHours(+value); },
        getMaxValue: () => 23,
        minValue: 0,
        getDifference: (now, end) => end.getHours() - now.getHours(),
        convertToUnit: (now, end) => Math.floor((end - now) / 1000 / 60 / 60),
    },
    {
        key: 'minute',
        onChange: (value, targetTime) => { targetTime.setMinutes(+value); },
        getMaxValue: () => 59,
        minValue: 0,
        getDifference: (now, end) => end.getMinutes() - now.getMinutes(),
        convertToUnit: (now, end) => Math.floor((end - now) / 1000 / 60),
    },
    {
        key: 'second',
        onChange: (value, targetTime) => { targetTime.setSeconds(+value); },
        getMaxValue: () => 59,
        minValue: 0,
        getDifference: (now, end) => end.getSeconds() - now.getSeconds(),
        convertToUnit: (now, end) => Math.floor((end - now) / 1000),
    }
];

const calculateTimeDifference = (startTime, endTime, inputs, maxUnit) => {
    const result = [0, 0, 0, 0, 0, 0];

    for (let i = inputs.length - 1; i >= 0; i--) {
        const input = inputs[i];

        if (maxUnit === input.key) {
            result[i] = input.convertToUnit(startTime, endTime);
            break;
        }

        result[i] += input.getDifference(startTime, endTime);

        if (result[i] < 0) {
            result[i] += input.getMaxValue(startTime) + 1 - input.minValue;
            result[i - 1]--;
        }
    }

    return result;
};

const assembleResultString = (
    years, 
    months,
    days,
    hours,
    minutes,
    seconds,
    maxUnit
) => {
    const yearString = years > 0
        ? `${years}y `
        : '';

    const monthString = months > 0 ?
        `${roundToTwoDigits(months)}m `
        : '';

    const dayString = days > 0
        ? `${roundToTwoDigits(days)}d `
        : '';

    const hourString = maxUnit !== 'minute' && maxUnit !== 'second'
        ? `${roundToTwoDigits(hours)}:`
        : '';

    const minuteString = maxUnit !== 'second'
        ? `${roundToTwoDigits(minutes)}:`
        : '';

    const secondString = `${roundToTwoDigits(seconds)}`;

    return `${yearString}${monthString}${dayString}${hourString}${minuteString}${secondString}`;
};

export const getRemainingTime = (endTime, inputs, maxUnit) => {
    const remaining = calculateTimeDifference(new Date(), endTime, inputs, maxUnit);
    return assembleResultString(...remaining, maxUnit);
};

export const getPassedTime = (startTime, inputs, maxUnit) => {
    const passed = calculateTimeDifference(startTime, new Date(), inputs, maxUnit);
    return assembleResultString(...passed, maxUnit);
};
