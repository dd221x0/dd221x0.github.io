var stringElem = document.getElementById("string");
var resultElem = document.getElementById("result");

function stingToGitBranchName(string){
	let result = "";
	result += string.replace(new RegExp(" +", "g"), "-");


	return result;
};

function convert(){
	resultElem.innerHTML = stingToGitBranchName(stringElem.value);
};


stringElem.oninput = convert;