const parts = document.querySelectorAll('#tetrahedron div');
const socials = document.querySelectorAll('#social a');
const email = document.querySelectorAll('#email a');
const utilsLinks = document.querySelectorAll('#utils a');
const utilsHeader = document.querySelectorAll('#utils h3');
const howmuchisleft = document.querySelectorAll('#howmuchisleft a');

const controls = Array.from(socials)
				.concat(Array.from(email))
				.concat(Array.from(utilsLinks))
				.concat(Array.from(howmuchisleft));

const allElements = controls.concat(Array.from(utilsHeader));

let color = '#BBBBBB';
let hoverColor = '#444444'

const getRandomColor = () => {
	let color = '#';
	let negative = '#';

	for (var i = 0; i < 3; i++ ) {
		let component = getRandomHexSymbol() + getRandomHexSymbol();
		color += component;
		negative += reflectHex(component);
	}

	return { color, negative };
}

const getRandomHexSymbol = () => {
	const symbols = '0123456789ABCDEF';
	return symbols[Math.floor(Math.random() * 16)];
}

const reflectHex = (hex) => {
	const reflectedValue = (0xFF - parseInt(hex, 16)).toString(16);
	
	if (reflectedValue.length === 1) {
		return '0' + reflectedValue;
	}

	return reflectedValue;
}

const setHoverColor = (elements) => {
	elements.forEach((el) => {
		el.onmouseover = () => {
			el.style.color = hoverColor;
		};
		el.onmouseout = () => {
			el.style.color = color;
		};
	})
}

const setColor = (elements) => {
	elements.forEach((e) => {
		e.style.color = color;
	})
}

const setElementEvent = (element, elements, dependents) => {
	element.addEventListener('click', (e) => {
		newColor = getRandomColor()
		color = newColor.color;
		hoverColor = newColor.negative;
		elements.forEach((el) => {
			el.style.borderBottomColor = color;
		});
		setColor(dependents)
		e.stopPropagation();
	});	
}

const setCursor = (element) => {
	element.style.cursor = 'pointer';
}

const tetrahedronInit = (elements, dependents) => {
	elements.forEach((element) => {
		setElementEvent(element,elements, dependents);
		setCursor(element);
	});
}


window.onload = () => {
	tetrahedronInit(parts, allElements);
	setHoverColor(controls);
}