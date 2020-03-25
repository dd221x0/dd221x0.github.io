const passwordElement = document.getElementById('password');
const stringElement = document.getElementById('string');
const partsCountElement = document.getElementById('partsCount');
const partElement = document.getElementById('part');
const resultElement = document.getElementById('result');
const copyElement = document.getElementById('copy');

let isPassword = true;

const GRAY = '#888888';
const MAGENTA = '#AA00AA';

const switchPasswordMode = () => {
	isPassword = !isPassword;
	passwordElement.style.color = isPassword ? MAGENTA : GRAY;
	
	stringElement.type = isPassword ? 'password' : 'text';
}

const getHashPart = (string, partsCount, part) => {
	if (!string) {
		return '';
	}
	
	if (!partsCount) {
		partsCount = 1;
	}

	if (!part) {
		part = 1;
	}

	const passwordHash = md5(string);
	const partLen = Math.floor(passwordHash.length / partsCount);
	return passwordHash.substring((part - 1) * partLen, part * partLen);
};

const isDigit = (value) => /^\d*$/.test(value);

const isExceed = (value) => +value > +partsCountElement.value;

const saveOldValue = (event) => {
	event.target.oldValue = event.target.value;
};

const setResult = () => {
	resultElement.value = getHashPart(stringElement.value, partsCountElement.value, partElement.value);
};

const partsCoutInputHandler = (event) => {
	const element = event.target;
	const newPartsCount = element.value;

	if (!isDigit(newPartsCount)){ 
		element.value = element.oldValue;
		return;
	}

	if (newPartsCount === '') {
		partElement.value = '';
	}
	else if (+newPartsCount > 32) {
		element.value = 32;
	}
	else if (+newPartsCount < +partElement.value) {
		partElement.value = element.value;
	}

	saveOldValue(event);

	setResult();
}

const partInputHandler = (event) => {
	const element = event.target;
	const partCount = element.value;

	if (!isDigit(partCount)) {
		element.value = element.oldValue;
		return;		
	}

	if (partsCountElement.value === '') {
		element.value = '';
	}
	else if (isExceed(partCount)) {
		element.value = +partsCountElement.value;
	}

	saveOldValue(event);

	setResult();
}

const copyResult = () => {
	resultElement.select();
  	document.execCommand('copy');
}

passwordElement.onclick = switchPasswordMode;
stringElement.oninput = setResult;
partsCountElement.onfocus = saveOldValue;
partsCountElement.oninput = partsCoutInputHandler;
partElement.onfocus = saveOldValue;
partElement.oninput = partInputHandler;
copyElement.onclick = copyResult;