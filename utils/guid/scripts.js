var submitElem = document.getElementById("submit");
var upperCaseElem = document.getElementById("upper_case");
var resultElem = document.getElementById("result");

let isUpperCase = false;

const GRAY = "#888888";
const PURPLE = "#AA00AA";

function calculate(){
	resultElem.innerHTML = isUpperCase ? guid().toUpperCase() : guid();
}

submit.onclick = calculate;

upperCaseElem.onclick = function(){
	isUpperCase = !isUpperCase;
	upperCaseElem.style.color = isUpperCase ? PURPLE : GRAY;
	let guid = resultElem.innerHTML;
	resultElem.innerHTML = isUpperCase ? guid.toUpperCase() : guid.toLowerCase();
}

window.onload = calculate;