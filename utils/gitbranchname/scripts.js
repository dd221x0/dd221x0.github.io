const stringElement = document.getElementById('string');
const resultElement = document.getElementById('result');

const stingToGitBranchName = (string) => string
		.replace(/[\~\^:\[\]\(\)\\]/g, '')
		.replace(/\.{2,}/g, '.')
		.replace(/\/\.+/g, '/')
		.replace(/( |(\.lock)|\/)+$/g, '')
		.replace(/[ \t]+/g, '-');

const convert = () => {
	resultElement.value = stingToGitBranchName(stringElement.value);
};


stringElement.oninput = convert;