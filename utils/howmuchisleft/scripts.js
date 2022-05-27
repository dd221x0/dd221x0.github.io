let endTime = new Date("2019-06-13T00:00:00+03:00");
let timeElement = document.getElementById("time");

let setCurrentTime = () => {
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
			let currentTimeFormatted = JSON.parse(e.target.response).formatted.replace(" ", "T") + "+03:00";
			setTimer(new Date(currentTimeFormatted));
		}
		else
		{
			setTimeout(() => setCurrentTime(setTimer), 1000);
		}
	};

	xhr.send();
};

let setTimer = (time) => {
	if(time >= endTime)
	{
		finished();
		return;
	} 

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

		if(secondsLeft-- <= 0)
		{
			finished();
			return;
		} 

		expected += interval;

		setTimeout(step, interval - dt);
	};

	step();
}

let finished = () => {
	timeElement.innerHTML = "nothing";
}

window.onload = setCurrentTime;
