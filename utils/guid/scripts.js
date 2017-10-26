var submitElem = document.getElementById("submit");
var upperCaseElem = document.getElementById("upper_case");
var resultElem = document.getElementById("result");

let isUpperCase = false;

const GRAY = "#888888";
const PURPLE = "#AA00AA";

submit.onclick = function(){
	resultElem.innerHTML = isUpperCase ? guid().toUpperCase() : guid();
}

upperCaseElem.onclick = function(){
	isUpperCase = !isUpperCase;
	upperCaseElem.style.color = isUpperCase ? PURPLE : GRAY;
	let guid = resultElem.innerHTML;
	resultElem.innerHTML = isUpperCase ? guid.toUpperCase() : guid.toLowerCase();
}