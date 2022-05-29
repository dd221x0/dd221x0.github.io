import { getCurrentColor } from "../common.js";

export const applyColor = () => {
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

    let currentColor = getCurrentColor();

    elementsWithBorder.forEach((element) => {
        element.style.borderColor = currentColor.color;
    });

    allElements.forEach((element) => {
        element.style.color = currentColor.color;
    });

    homeButton.style.borderBottomColor = currentColor.color;

    homeButton.onmouseover = () => {
        homeButton.style.borderBottomColor = currentColor.negative;
    };
    
    homeButton.onmouseout = () => {
        homeButton.style.borderBottomColor = currentColor.color;
    };

    buttons.forEach((button) => {
        button.onmouseover = () => {
            button.style.borderColor = currentColor.negative;
            button.style.color = currentColor.negative;
        };

        button.onmouseout = () => {
            button.style.borderColor = currentColor.color;
            button.style.color = currentColor.color;
        };
    });

    inputs.forEach((input) => {
        input.classList.add('active');
    });
};
