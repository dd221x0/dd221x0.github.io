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
	let socials = document.querySelectorAll("#social a");
	let email = document.querySelectorAll("#email a");

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
			// 	el.style.color = color;


			// color = getRandomColor();
			// socials.forEach((el) =>{
			// 	el.style.color = color;
			// 	el.onmouseover = () => {
			// 		el.style.color = '#333333'
			// 	};
			// 	el.onmouseout = () => {
			// 		el.style.color = color;
			// 	};
			// });
			// email.forEach((el) =>{
			// 	el.style.color = color;
			// 	el.onmouseover = () => {
			// 		el.style.color = '#333333'
			// 	};
			// 	el.onmouseout = () => {
			// 		el.style.color = color;
			// 	};
			// });
		})
	})

	document.getElementsByTagName('body')[0].addEventListener('click', () => {
		parts.forEach((el) =>{
				el.style.borderBottomColor = '#000';
			}
			)});
}