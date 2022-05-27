const deleteElements = [...document.getElementsByClassName('delete')];
const nameElements = [...document.getElementsByClassName('name')];
const contributionElements = [...document.getElementsByClassName('contribution')];
const debtsElement = document.getElementById('debts');
const addElement = document.getElementById('add');

let count = 3;

const names = [];
const contributionsPerPerson = [];
const debts = [];

const setName = (index) => {
	names[index] = nameElements[index].value;
	displayResult();
};

const changeDebt = (index) => {
	const contribution = contributionElements[index].value;
	contributionsPerPerson[index] = contribution / count;
	calculateDebts();
	displayResult();
};

const calculateDebts = () => {
	for (let i = 0; i < count - 1; i++) {
		debts[i] = [];
		for (let j = i + 1; j < count; j++) {
			debts[i][j] = contributionsPerPerson[j] - contributionsPerPerson[i];
		}
	}
};

const createDebtElement = (i, j, debt) => {
	if (+debt.toFixed(2) === 0) {
		return '';
	};

	let result;

	if (debt > 0) {
		result = `${names[i]} <i class="fas fa-angle-right"></i> ${names[j]}: ${debt.toFixed(2)}`;
	}
	else if (debt < 0) {
		result = `${names[j]} <i class="fas fa-angle-right"></i> ${names[i]}: ${(debt * -1).toFixed(2)}`;
	}

	return (
		`<div class="row">
			<span class="debt">
				${result}
			</span>
		</div>`
	);
};

const displayResult = () => {
	let result = '';

	for (let i = 0; i < count - 1; i++) {
		for (let j = i + 1; j < count; j++) {
			const debt = debts[i][j];
			result += createDebtElement(i, j, debt);
		}
	}

	debtsElement.innerHTML = result;
};

const addPerson =  () => {
	const index = count;

	const newElement = document.createElement('div');
	newElement.className = 'row';

	const deleteElement = document.createElement('button');
	deleteElement.className = 'delete';
	deleteElement.innerHTML = 'x';

	deleteElement.onclick = () => deletePerson(index);
	deleteElements.push(deleteElement);

	const nameElement = document.createElement('input');
	nameElement.className = 'name';
	nameElement.placeholder = 'name';
	nameElement.type = 'text';

	nameElement.oninput = () => setName(index);
	nameElements.push(nameElement);

	const contributionElement = document.createElement('input');
	contributionElement.className = 'contribution';
	contributionElement.placeholder = 'contribution';
	contributionElement.type = 'number';

	contributionElement.oninput = () => changeDebt(index);
	contributionElements.push(contributionElement);

	newElement.appendChild(deleteElement);
	newElement.appendChild(nameElement);
	newElement.appendChild(contributionElement);

	addElement.parentNode.insertBefore(newElement, addElement);
	contributionsPerPerson[index] = 0;
	count++;
};

const deletePerson = (index) => {
	nameElements[index].parentElement.remove();
	count--;
};

window.onload = () => {
	for (let index = 0; index < count; index++) {
		contributionsPerPerson[index] = 0;
		deleteElements[index].onclick = () => deletePerson(index);
		nameElements[index].oninput = () => setName(index);
		contributionElements[index].oninput = () => changeDebt(index);
	}

	addElement.onclick = addPerson;
};
