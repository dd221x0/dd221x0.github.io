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
    	console.log([color, negative])
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

	function setTetrahedronHover(element, elements){
        element.onmouseover = () => {
            elements.forEach((e) => {
                e.style.borderBottomColor = hoverColor;
            })
        };
        element.onmouseout = () => {
            elements.forEach((e) =>{
                e.style.borderBottomColor = color;
            });
        };
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

	function tetrahedronInit(elements, dependents){
		elements.forEach((element) => {
			setElementEvent(element,elements, dependents);
			setTetrahedronHover(element,elements);
			setCursor(element);
		});
	}

	function setColor(elements){
		elements.forEach((e) => {
			e.style.color = color;
		})
	}

	function setCursor(element){
		element.style.cursor = "pointer";
	}

	let parts = document.querySelectorAll("#tetrahedron div");
	let socials = document.querySelectorAll("#social a");
	let email = document.querySelectorAll("#email a");
	let controls = Array.from(socials).concat(Array.from(email));

	let color = '#FFFFFF';
	let hoverColor = '#000000'
	
	tetrahedronInit(parts, controls);
	setHoverColor(controls);
}