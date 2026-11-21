const generateRgbComponent = () => Math.trunc(Math.random() * 0x100);

const getRandomRgb = () => ({
    r: generateRgbComponent(),
    g: generateRgbComponent(),
    b: generateRgbComponent(),
});

export {
    getRandomRgb,
};
