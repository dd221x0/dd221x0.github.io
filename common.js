export const defaultColor = {color: '#BBBBBB', negative: '#444444'};
export const placeholderColor = '#888888'; 

export const getCurrentColor = () => {
    return JSON.parse(localStorage.getItem('color')) || defaultColor;
};