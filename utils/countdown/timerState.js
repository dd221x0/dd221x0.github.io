const INTERVAL = 1000;

let isRunning = false;

const updateCountdownTimer = (updateTime, endTime, onUpdate, onFinished) => {
    if (!isRunning) {
        return;
    }

    if (updateTime >= endTime) {
        stopTimer();
        onFinished();
        return;
    }

    onUpdate();

    const currentTime = Date.now();

    const timeDifference = currentTime - updateTime;
    const newUpdateTime = timeDifference > INTERVAL 
        ? currentTime + INTERVAL
        : updateTime + INTERVAL;

    setTimeout(
        () => updateCountdownTimer(newUpdateTime, endTime, onUpdate, onFinished),
        INTERVAL - timeDifference,
    );
};

export const startTimer = (endTime, onUpdate, onFinished) => {
    if (isRunning) {
        return;
    }

    isRunning = true;

    updateCountdownTimer(Date.now(), endTime, onUpdate, onFinished);
};

const stopTimer = () => {
    isRunning = false;
};
