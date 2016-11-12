window.onload = () => {

	function getRandomColor() {
    	let letters = '0123456789ABCDEF';
    	let color = '#';
    	for (var i = 0; i < 6; i++ ) {
    	    color += letters[Math.floor(Math.random() * 16)];
    	}
    	return color;
	}

	function setHover(elements) {
		elements.forEach((el) => {
			el.onmouseover = () => {
				el.style.color = hoverColor;
			};
			el.onmouseout = () => {
				el.style.color = '#AAAAAA';
			};
		}
	)
	}

	function setTetrahedronHover(elements){
		elements.forEach((el) => {
			el.onmouseover = () => {
				elements.forEach((e) => {
					e.style.borderBottomColor = color;
				})
			};
			el.onmouseout = () => {
				if(!clicked){
					elements.forEach((e) =>{
						e.style.borderBottomColor = background;
					});
				}
			};
		});
	}

	function setTetrahedronEvent(elements){
		elements.forEach((el) => {
			el.addEventListener('click', (e) => {
				if(clicked){
					color = getRandomColor();
					elements.forEach((el) => {
						el.style.borderBottomColor = color;
					});
				}
				else{
					clicked = true;
				}
				e.stopPropagation();
			});

		})
		document.addEventListener('click', (el)=>{
			clicked = false;
			elements.forEach((e) =>{
				e.style.borderBottomColor = background;
			});
		})
	}

	function tetrahedronInit(elements){
		setTetrahedronHover(elements);
		setTetrahedronEvent(elements);
	}

	let parts = document.querySelectorAll("#tetrahedron div");
	let socials = document.querySelectorAll("#social a");
	let email = document.querySelectorAll("#email a");

	let color = '#AAAAAA';
	let hoverColor = '#333333';
	let background = '#000000'

	let clicked = false;
	
	tetrahedronInit(parts);
	setHover(socials);
	setHover(email);
}