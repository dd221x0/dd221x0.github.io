import { applyColor } from "../applyColor.js";

const setupPage = () => {
	const stringElement = document.getElementById('string');
	const resultElement = document.getElementById('result');
	const copyElement = document.getElementById('copy');
	
	const stingToGitBranchName = (string) => string
			.replace(/[\~\^:\[\]\(\)\\]/g, '')
			.replace(/\.{2,}/g, '.')
			.replace(/\/\.+/g, '/')
			.replace(/( |(\.lock)|\/)+$/g, '')
			.replace(/[ \t]+/g, '-');
	
	const convert = () => {
		resultElement.value = stingToGitBranchName(stringElement.value);
	};
	
	const copyResult = () => {
		resultElement.select();
	  	document.execCommand('copy');
	}
	
	stringElement.oninput = convert;
	copyElement.onclick = copyResult;
};

window.onload = () => {
	applyColor();
	setupPage();
};
