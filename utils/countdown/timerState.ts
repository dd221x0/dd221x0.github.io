const INTERVAL = 1000;
const MAX_TIMEOUT_DELAY = 2 ** 31 - 1;

let isRunning = false;

let startTime: number | null = null;
let endTime: number | null = null;

let pendingTimerId: number | null = null;

const startLater = (onUpdate: () => void, onInactive: () => void) => {
    const delay = startTime! - Date.now();

    if (delay > MAX_TIMEOUT_DELAY) {
        return;
    }

    pendingTimerId = setTimeout(
        () => {
            pendingTimerId = null;
            isRunning = true;
            update(startTime!, onUpdate, onInactive);
        },
        delay,
    );
};

const update = (updateTime: number, onUpdate: () => void, onInactive: () => void) => {
    if (!isRunning) {
        return;
    }

    if (endTime && updateTime >= endTime) {
        stop();
        onInactive();
        return;
    }

    if (startTime && startTime > updateTime) {
        stop();
        onInactive();
        startLater(onUpdate, onInactive);
        return;
    }

    onUpdate();

    const currentTime = Date.now();

    const timeDifference = currentTime - updateTime;
    const newUpdateTime = timeDifference > INTERVAL 
        ? currentTime + INTERVAL
        : updateTime + INTERVAL;

    setTimeout(
        () => update(newUpdateTime, onUpdate, onInactive),
        INTERVAL - timeDifference,
    );
};

export const start = (time: Date, isCountup: boolean, onUpdate: () => void, onInactive: () => void) => {
    startTime = isCountup ? time.getTime() : null;
    endTime = isCountup ? null : time.getTime();

    if (isRunning) {
        return;
    }

    if (pendingTimerId) {
        clearTimeout(pendingTimerId);
        pendingTimerId = null;
    }

    isRunning = true;

    update(Date.now(), onUpdate, onInactive);
};

const stop = () => {
    isRunning = false;
};
