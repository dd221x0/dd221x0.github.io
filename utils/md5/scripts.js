var stringElem = document.getElementById("string");
var partsCountElem = document.getElementById("partsCount");
var partElem = document.getElementById("part");
var resultElem = document.getElementById("result");

function getHashPart(string, partsCount, part){
	if (!partsCount) {
		partsCount = 1;
	}
	if (!part) {
		part = 1;
	}
	var passwordHash = md5(string);
	var partLen = Math.floor(passwordHash.length / partsCount);
	return passwordHash.substring((part - 1) * partLen, part * partLen);
};

function saveOldValue(event){
	event.target.oldValue = event.target.value;
};

function numberFilter(event, additionalCheck){
	var elem = event.target;
	var regex = /^\d*$/;
	if(!regex.test(elem.value) 
		|| !(+elem.value > 0 || elem.value === "")
		|| (additionalCheck && !additionalCheck(event))){
		elem.value = elem.oldValue;
		event.returnValue = false;
		event.preventDefault();
	}
	else{
		saveOldValue(event);
	}
};

function calculate(){
	resultElem.innerHTML = getHashPart(stringElem.value, partsCountElem.value, partElem.value);
};

partsCountElem.onfocus = saveOldValue;

partElem.onfocus = saveOldValue;

partsCountElem.oninput = function(event){
	numberFilter(event)
	var elem = event.target;
	if(elem.value > 32){
		elem.value = 32;
	}
	if(elem.value === ""){
		partElem.value = "";
	}
	else if(+elem.value < +partElem.value){
		partElem.value = elem.value;
	}
	calculate();
};

partElem.oninput = function(event){
	numberFilter(event, function(event){
			return +event.target.value <= +partsCountElem.value;
		});
	calculate();
};

stringElem.oninput = calculate;