var stringElem = document.getElementById("string");
var partsCountElem = document.getElementById("partsCount");
var partElem = document.getElementById("part");
var submitElem = document.getElementById("submit");
var resultElem = document.getElementById("result");

function get_hash_part(string, partsCount, part){
	if (!partsCount) {
		partsCount = 1;
	}
	if (!part) {
		part = 1;
	}
	var password_hash = md5(string);
	var part_len = Math.floor(password_hash.length / partsCount);
	return password_hash.substring((part - 1) * part_len, part * part_len);
}

var saveOldValue = function(event){
	event.target.oldValue = event.target.value;
}

var numberFilter = function(event, additionalCheck){
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
}

submit.onclick = function(){
	resultElem.innerHTML = get_hash_part(stringElem.value, partsCountElem.value, partElem.value);
}

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
}

partElem.oninput = function(event){
	numberFilter(event, function(event){
			return +event.target.value <= +partsCountElem.value;
		});
}