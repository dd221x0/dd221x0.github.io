import { defaultColor, getCurrentColor } from "./common.js";

const parts = document.querySelectorAll('#tetrahedron div');
const socials = document.querySelectorAll('#social a');
const email = document.querySelectorAll('#email a');
const utilsLinks = document.querySelectorAll('#utils a');
const utilsHeader = document.querySelectorAll('#utils h3');

const controls = [
	...socials,
	...email,
	...utilsLinks,
];

const allElements = [...controls, ...utilsHeader];

let currentColor = getCurrentColor();

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
			el.style.color = currentColor.negative;
		};
		el.onmouseout = () => {
			el.style.color = currentColor.color;
		};
	})
}

const setColor = (elements, parts) => {
	elements.forEach((e) => {
		e.style.color = currentColor.color;
	})

    parts.forEach((el) => {
        el.style.borderBottomColor = currentColor.color;
    });
};

const setElementEvent = (element, parts, dependents) => {
	element.addEventListener('click', (e) => {
		currentColor = getRandomColor();

		saveColor(currentColor);
		setColor(dependents, parts);

		e.stopPropagation();
	});

    element.addEventListener('dbclick', (e) => {
        currentColor = defaultColor;

        setColor(allElements, parts);
        saveColor(currentColor);

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
	tetrahedronInit(parts, allElements);
    setColor(allElements, parts);
	setHoverColor(controls);
};