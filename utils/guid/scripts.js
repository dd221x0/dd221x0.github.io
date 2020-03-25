const submitElement = document.getElementById('submit');
const upperCaseElement = document.getElementById('upper_case');
const resultElement = document.getElementById('result');

let isUpperCase = false;

const GRAY = '#888888';
const MAGENTA = '#AA00AA';

const calculate = () => {
	resultElement.value = isUpperCase ? guid().toUpperCase() : guid();
}

const changeCase = () => {
	const guid = resultElement.value;

	isUpperCase = !isUpperCase;
	upperCaseElement.style.color = isUpperCase ? MAGENTA : GRAY;
	resultElement.value = isUpperCase ? guid.toUpperCase() : guid.toLowerCase();
}

submit.onclick = calculate;
upperCaseElement.onclick = changeCase;
window.onload = calculate;