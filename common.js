const defaultColor = {color: '#BBBBBB', negative: '#444444'};
const placeholderColor = '#888888'; 

const getCurrentColor = () => {
    return JSON.parse(localStorage.getItem('color')) || defaultColor;
};

export {
    defaultColor,
    placeholderColor,
    getCurrentColor,
}
