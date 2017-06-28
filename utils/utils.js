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
	if (partsCount < part){
		//exception
	}
	var password_hash = md5(string);
	var part_len = Math.floor(password_hash.length / partsCount);
	return password_hash.substring((part - 1) * part_len, part * part_len);
}

submit.onclick = function(){
	resultElem.innerHTML = get_hash_part(stringElem.value, partsCountElem.value, partElem.value);
}

partsCountElem.onkeydown = function(){

}

partElem.onkeyup = function(){
	
}