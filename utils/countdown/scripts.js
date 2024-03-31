const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_AN_HOUR = 60 * 60;
const SECONDS_IN_A_MINUTE = 60;
const INTERVAL = 1000;

const endTime = new Date("2024-06-13T00:00:00+01:00");
const timeElement = document.getElementById("time");

const timeApiUrl = "https://api.timezonedb.com/v2/get-time-zone?key=692FL2W84HRV&by=zone&zone=Europe/Warsaw&format=json";

const getCurrentTime = async () => {
    try {
        const response = await fetch(timeApiUrl);

        if (!response.ok) {
            throw new Error(`Time service request failed with status: ${response.status}`);
        }

        const data = await response.json();
        const currentTimeFormatted = data.formatted.replace(" ", "T") + "+01:00";

        return new Date(currentTimeFormatted);
    } catch (error) {
        console.error(error);
        return await new Promise((resolve) => {
            setTimeout(() => resolve(getCurrentTime()), 1000);
        });
    }
};

const setCountdownValue = (secondsLeft) => {
    const days = Math.floor(secondsLeft / SECONDS_IN_A_DAY);
    const hours = ("0" + Math.floor((secondsLeft / SECONDS_IN_AN_HOUR) % 24)).slice(-2);
    const minutes = ("0" + Math.floor((secondsLeft / SECONDS_IN_A_MINUTE) % 60)).slice(-2);
    const seconds = ("0" + Math.floor(secondsLeft % 60)).slice(-2);

    timeElement.innerText = `${days}d ${hours}:${minutes}:${seconds}`;
};

const updateCountdownTimer = (secondsLeft, updateTime) =>
{
    const timeDifference = Date.now() - updateTime;

    setCountdownValue(secondsLeft);

    if(secondsLeft <= 0)
    {
        setFinished();
        return;
    }

    setTimeout(
        () => updateCountdownTimer(secondsLeft -1, updateTime + INTERVAL),
        INTERVAL - timeDifference,
    );
};

const setTimer = (currentTime) => {
    if(currentTime >= endTime)
    {
        setFinished();
        return;
    } 
    
    const secondsLeft = (endTime - currentTime)/1000;

    updateCountdownTimer(secondsLeft, Date.now());
};

const setFinished = () => {
    timeElement.innerText = "nothing";
};

const startCountdown = async () => {
    const currentTime = await getCurrentTime();
    setTimer(currentTime);
};

window.onload = startCountdown;
