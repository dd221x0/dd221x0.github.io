let endTime = new Date(2019, 5, 13);
let curentTime;


function setCurrentTime()
{
	let timeApiUrl = "http://api.timezonedb.com/v2/get-time-zone?key=692FL2W84HRV&by=zone&zone=Europe/Minsk&format=json"

	let xhr = new XMLHttpRequest();
	xhr.open('GET', timeApiUrl, true);

	xhr.onreadystatechange = (e) =>
	{
		console.log(e);
	};

	xhr.send();
};

function setTime(e)
{

}