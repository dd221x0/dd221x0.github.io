let endTime = new Date(2019, 5, 13);

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
	let difference = (endTime - time)/1000;

	setInterval(() => 
		{
			document.getElementById("time").innerHTML = `${~~(difference/(24*60*60))} ${~~(difference/(60*60))%24}:${~~(difference/60)%60}:${~~difference%60}`;
			difference--;
		}
		, 1000);
}

window.onload = () => setCurrentTime(setTimer);