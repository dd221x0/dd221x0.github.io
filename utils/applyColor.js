(function(){
    const inputs = document.querySelectorAll('input');
    const buttons = document.querySelectorAll('button');
    const result = document.getElementById('result');
    const homeButton = document.getElementById('triangle');

    const elementsWithBorder = [
        ...inputs,
        ...buttons,
    ];

    const allElements = [
        ...elementsWithBorder,
        result,
    ];

    const color = JSON.parse(localStorage.getItem('color'));

    elementsWithBorder.forEach((element) => {
        element.style.borderColor = color.color;
    });

    allElements.forEach((element) => {
        element.style.color = color.color;
    });

    homeButton.style.borderBottomColor = color.color;

    homeButton.onmouseover = () => {
        homeButton.style.borderBottomColor = color.negative;
    };
    
    homeButton.onmouseout = () => {
        homeButton.style.borderBottomColor = color.color;
    };

    buttons.forEach((button) => {
        button.onmouseover = () => {
            button.style.borderColor = color.negative;
            button.style.color = color.negative;
        };

        button.onmouseout = () => {
            button.style.borderColor = color.color;
            button.style.color = color.color;
        };
    });
})();
