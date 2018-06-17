let endTime = new Date(2019, 5, 13);
let timeElement = document.getElementById("time");

function setCurrentTime(callback)
{
	let timeApiUrl = "http://api.timezonedb.com/v2/get-time-zone?key=692FL2W84HRV&by=zone&zone=Europe/Minsk&format=json"

	let xhr = new XMLHttpRequest();

	let resultRecieved = false;

	xhr.open('GET', timeApiUrl, true);

	xhr.onreadystatechange = (e) =>
	{
		if(resultRecieved || (e.target.status === 200 && !e.target.response))
		{
			return;
		}

		resultRecieved = true;

		if(e.target.status === 200)
		{
			callback(new Date(JSON.parse(e.target.response).formatted));
		}
		else
		{
			setTimeout(() => setCurrentTime(callback), 1000);
		}
	};

	xhr.send();
};

function setTimer(time)
{
	let interval = 1000;
	let expected = Date.now();
	let secondsLeft = (endTime - time)/1000;

	let step = () =>
	{
		let dt = Date.now() - expected;

		let days = ~~(secondsLeft/(24*60*60));
		let hours = ("0" + ~~(secondsLeft/(60*60))%24).slice(-2);
		let minutes = ("0" + ~~(secondsLeft/60)%60).slice(-2);
		let seconds = ("0" + ~~(secondsLeft%60)).slice(-2);
	
		timeElement.innerHTML = `${days} ${hours}:${minutes}:${seconds}`;

		secondsLeft--;
		expected += interval;

		setTimeout(step, interval - dt);
	};

	step();
}

window.onload = () => setCurrentTime(setTimer);