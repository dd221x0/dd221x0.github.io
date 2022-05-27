const parts = document.querySelectorAll('#tetrahedron div');
const socials = document.querySelectorAll('#social a');
const email = document.querySelectorAll('#email a');
const utilsLinks = document.querySelectorAll('#utils a');
const utilsHeader = document.querySelectorAll('#utils h3');
const howmuchisleft = document.querySelectorAll('#howmuchisleft a');

const controls = [
	...socials,
	...email,
	...utilsLinks,
	...howmuchisleft
];

const allElements = [...controls, ...utilsHeader];

let mainColor = '#BBBBBB';
let hoverColor = '#444444';

const getRandomColor = () => {
	let color = '#';
	let negative = '#';

	for (var i = 0; i < 3; i++ ) {
		let component = getRandomHexSymbol() + getRandomHexSymbol();
		color += component;
		negative += inverseColor(component);
	}

	return { color, negative };
};

const getRandomHexSymbol = () => {
	const symbols = '0123456789ABCDEF';
	return symbols[Math.floor(Math.random() * 16)];
};

const inverseColor = (hex) => {
	const inversedColor = (0xFF - parseInt(hex, 16)).toString(16);
	
	if (inversedColor.length === 1) {
		return '0' + inversedColor;
	}

	return inversedColor;
};

const setHoverColor = (elements) => {
	elements.forEach((el) => {
		el.onmouseover = () => {
			el.style.color = hoverColor;
		};
		el.onmouseout = () => {
			el.style.color = mainColor;
		};
	})
}

const setColor = (elements) => {
	elements.forEach((e) => {
		e.style.color = mainColor;
	})
};

const setElementEvent = (element, elements, dependents) => {
	element.addEventListener('click', (e) => {
		newColor = getRandomColor();

		saveColor(newColor);

		mainColor = newColor.color;
		hoverColor = newColor.negative;

		elements.forEach((el) => {
			el.style.borderBottomColor = mainColor;
		});

		setColor(dependents);

		e.stopPropagation();
	});	
};

const saveColor = (color) => {
	localStorage.setItem('color', JSON.stringify(color));
};

const setCursor = (element) => {
	element.style.cursor = 'pointer';
};

const tetrahedronInit = (elements, dependents) => {
	elements.forEach((element) => {
		setElementEvent(element, elements, dependents);
		setCursor(element);
	});
};


window.onload = () => {
	saveColor({color: mainColor, negative: hoverColor});
	tetrahedronInit(parts, allElements);
	setHoverColor(controls);
};