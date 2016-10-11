window.onload = () => {

	function getRandomColor() {
    	var letters = '0123456789ABCDEF';
    	var color = '#';
    	for (var i = 0; i < 6; i++ ) {
    	    color += letters[Math.floor(Math.random() * 16)];
    	}
    	return color;
	}

	let parts = document.querySelectorAll("#tetrahedron div");

	let color = '#AAAAAA';

	parts.forEach((el) =>{
				el.onmouseover = () => {
					parts.forEach((e) => {
						e.style.borderBottomColor = color;
					}
					)
				};
				el.onmouseout = () => {
					parts.forEach((e) =>{
						e.style.borderBottomColor = '#000';
					}
					) ;
				};
			});

	parts.forEach((element) => {
		element.addEventListener('click', (e)=>{
			color = getRandomColor();
			parts.forEach((el) =>{
				el.style.borderBottomColor = color;
			});
			e.stopPropagation();
		})
	})
}