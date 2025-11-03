const INTERVAL = 1000;

let isRunning = false;

let startTime = null;
let endTime = null;

let pendingTimerId = null;

const startLater = (onUpdate, onInactive) => {
    pendingTimerId = setTimeout(
        () => {
            pendingTimerId = null;
            isRunning = true;
            update(startTime, onUpdate, onInactive);
        },
        startTime - Date.now(),
    );
};

const update = (updateTime, onUpdate, onInactive) => {
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

export const start = (time, isCountup, onUpdate, onInactive) => {
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
