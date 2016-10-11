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
					}
					)
				};
				el.onmouseout = () => {
					elements.forEach((e) =>{
						e.style.borderBottomColor = '#000';
					}
					) ;
				};
			});
	}

	function setTetrahedronEvent(elements){
		elements.forEach((el) => {
		el.addEventListener('click', (e)=>{
			hoverColor = color = getRandomColor();
			elements.forEach((el) =>{
				el.style.borderBottomColor = color;
			});
			e.stopPropagation();
		})
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
	
	tetrahedronInit(parts);
	setHover(socials);
	setHover(email);
}