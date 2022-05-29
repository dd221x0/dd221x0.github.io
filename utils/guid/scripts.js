import { getCurrentColor, placeholderColor } from "../../common.js";
import { applyColor } from "../applyColor.js";
import { guid } from "./guid.js";

const setupPage = () => {
	const submitElement = document.getElementById('submit');
	const upperCaseElement = document.getElementById('upper_case');
	const resultElement = document.getElementById('result');
	const copyElement = document.getElementById('copy');

	let isUpperCase = false;

	const currentColor = getCurrentColor();

	const calculate = () => {
		resultElement.value = isUpperCase ? guid().toUpperCase() : guid();
	}

	const changeCase = () => {
		const guid = resultElement.value;

		isUpperCase = !isUpperCase;
		upperCaseElement.style.color = isUpperCase ? currentColor.color : placeholderColor;
		resultElement.value = isUpperCase ? guid.toUpperCase() : guid.toLowerCase();
	}

	const copyResult = () => {
		resultElement.select();
	  	document.execCommand('copy');
	}

	submitElement.onclick = calculate;
	upperCaseElement.onclick = changeCase;
	copyElement.onclick = copyResult;

	calculate();
};

window.onload = () => {
	applyColor();
	setupPage();
};