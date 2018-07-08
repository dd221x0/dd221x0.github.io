var stringElem = document.getElementById("string");
var resultElem = document.getElementById("result");

function stingToGitBranchName(string){
	let result = string
		.replace(/[\~\^:\[\]\\]/g, "")
		.replace(/\.{2,}/g, ".")
		.replace(/\/\.+/g, "/")
		.replace(/( |(\.lock)|\/)+$/g, "")
		.replace(/ +/g, "-");

	return result;
};

function convert(){
	resultElem.innerHTML = stingToGitBranchName(stringElem.value);
};


stringElem.oninput = convert;