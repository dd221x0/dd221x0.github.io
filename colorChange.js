window.onload = () => {

	function getRandomColor() {
		let letters = '0123456789ABCDEF';
		let color = '#';
		let negative = '#';
		for (var i = 0; i < 3; i++ ) {
			let component = letters[Math.floor(Math.random() * 16)];
			component += letters[Math.floor(Math.random() * 16)];
			color += component;
			negativeComponent = (0xFF - parseInt(component, 16)).toString(16)
			if (negativeComponent.length == 1){
				negativeComponent = '0' + negativeComponent;
			}
			negative += negativeComponent;
		}
		return [color, negative];
	}

	function setHoverColor(elements) {
		elements.forEach((el) => {
			el.onmouseover = () => {
				el.style.color = hoverColor;
			};
			el.onmouseout = () => {
				el.style.color = color;
			};
		})
	}

	function setColor(elements){
		elements.forEach((e) => {
			e.style.color = color;
		})
	}

	function setElementEvent(element, elements, dependents){
		element.addEventListener('click', (e) => {
			newColor = getRandomColor()
			color = newColor[0];
			hoverColor = newColor[1];
			elements.forEach((el) => {
				el.style.borderBottomColor = color;
			});
			setColor(dependents)
			e.stopPropagation();
		});	
	}

	function setCursor(element){
		element.style.cursor = "pointer";
	}
	
	function tetrahedronInit(elements, dependents){
		elements.forEach((element) => {
			setElementEvent(element,elements, dependents);
			setCursor(element);
		});
	}

	let parts = document.querySelectorAll("#tetrahedron div");
	let socials = document.querySelectorAll("#social a");
	let email = document.querySelectorAll("#email a");
	let utilsLinks = document.querySelectorAll("#utils a");
	let utilsHeader = document.querySelectorAll("#utils h3");
	let howmuchisleft = document.querySelectorAll("#howmuchisleft a");
	let controls = Array.from(socials)
					.concat(Array.from(email))
					.concat(Array.from(utilsLinks))
					.concat(Array.from(howmuchisleft));
	let allElements = controls
					.concat(Array.from(utilsHeader));

	let color = '#BBBBBB';
	let hoverColor = '#444444'
	
	tetrahedronInit(parts, allElements);
	setHoverColor(controls);
}