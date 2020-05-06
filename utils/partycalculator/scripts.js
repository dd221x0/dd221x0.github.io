const nameElements = document.getElementsByClassName('name');
const contributionElements = document.getElementsByClassName('contribution');

const debtsElement = document.getElementById('debts');//temp

let count = nameElements.length;

const names = [];
const contributionsPerPerson = [];

const setName = (index) => {
	names[index] = nameElements[index].value;
	showResults();
};

const changeDebt = (index) => {
	const contribution = contributionElements[index].value;
	contributionsPerPerson[index] = contribution / count;
	showResults();
};

const showResults = () => {
	let result = '';

	for (let i = 0; i < count; i++) {
		for (let j = i + 1; j < count; j++) {
			let debt = contributionsPerPerson[j] - contributionsPerPerson[i];
			if (debt > 0) {
				result += `${names[i]} <i class="fas fa-angle-right"></i> ${names[j]}: ${debt.toFixed(2)}<br>`
			}
			else if (debt < 0) {
				result += `${names[j]} <i class="fas fa-angle-right"></i> ${names[i]}: ${debt.toFixed(2) * -1}<br>`
			}
		}
	}

	debtsElement.innerHTML = result;
}

window.onload = () => {
	for (let index = 0; index < count; index++) {
		contributionsPerPerson[index] = 0;
		nameElements[index].oninput = () => setName(index);
		contributionElements[index].oninput = () => changeDebt(index);
	}
};
