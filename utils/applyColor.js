import { getCurrentColor } from "../common.js";
import { setIcon } from "../icon.js";

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

const currentColor = getCurrentColor();

const applyColorForElementsWithBorder = () => {
    elementsWithBorder.forEach((element) => {
        element.style.borderColor = currentColor.color;
    });
};

const applyColorForAllElements = () => {
    allElements.forEach((element) => {
        element.style.color = currentColor.color;
    });
};

const applyColorForHomeButton = () => {
    homeButton.style.borderBottomColor = currentColor.color;

    homeButton.onmouseover = () => {
        homeButton.style.borderBottomColor = currentColor.negative;
    };
    
    homeButton.onmouseout = () => {
        homeButton.style.borderBottomColor = currentColor.color;
    };
};

const applyColorForButtons = () => {
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
};

const applyColorForInputs = () => {
    inputs.forEach((input) => {
        input.classList.add('active');
    });
};

const applyColor = () => {
    applyColorForElementsWithBorder();
    applyColorForAllElements();
    applyColorForHomeButton();
    applyColorForButtons();
    applyColorForInputs();
    setIcon();
};

export {
    applyColor,
}
