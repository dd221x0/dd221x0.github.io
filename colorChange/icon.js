import { 
    getCurrentColorPair,
    defaultColorPair,
} from './common.js';

const x1 = 0.9770066967932373;
const y1 = 0.01108087050416906;
const x2 = 0.7181876516907166;
const y2 = 0.9770066967932373;
const x3 = 0.01108087050416906;
const y3 = 0.26989991560668986;

const getCanvas = (size) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    return canvas;
};

const drawTriangle = (canvas) => {
    const canvasContext = canvas.getContext('2d');

    canvasContext.drawImage(new Image(), 0, 0);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    const x1scaled = x1 * canvas.width;
    const y1scaled = y1 * canvas.height;
    const x2scaled = x2 * canvas.width;
    const y2scaled = y2 * canvas.height;
    const x3scaled = x3 * canvas.width;
    const y3scaled = y3 * canvas.height;

    canvasContext.fillStyle = getCurrentColorPair().color;
    canvasContext.beginPath();
    canvasContext.moveTo(x1scaled, y1scaled);
    canvasContext.lineTo(x2scaled, y2scaled);
    canvasContext.lineTo(x3scaled, y3scaled);
    canvasContext.fill();
};

const isDefaultIcon = (iconLink, size) => getCurrentColorPair().color === defaultColorPair.color
    && iconLink?.href === `${location.origin}/icon-${size}.png`;

const updateIcon = (size) => {
    let iconLink = document.querySelector(`link[rel="icon"][sizes="${size}x${size}"]`);

    if (isDefaultIcon(iconLink, size)) {
        return;
    }

    const canvas = getCanvas(size);
    drawTriangle(canvas);

    if (iconLink) {
        iconLink.href = canvas.toDataURL('image/png');
        return;
    }

    iconLink = document.createElement('link');
    iconLink.rel = 'icon';
    iconLink.type = 'image/png';
    iconLink.sizes = `${canvas.width}x${canvas.height}`;
    iconLink.href = canvas.toDataURL('image/png');
    document.getElementsByTagName('head')[0].appendChild(iconLink);
}

const updateTouchIcon = (size) => {
    let iconLink = document.querySelector('link[rel="apple-touch-icon"]');

    if (isDefaultIcon(iconLink, size)) {
        return;
    }

    const canvas = getCanvas(size);
    drawTriangle(canvas);

    if (iconLink) {
        iconLink.href = canvas.toDataURL('image/png');
        return;
    }

    iconLink = document.createElement('link');
    iconLink.rel = 'apple-touch-icon';
    iconLink.href = canvas.toDataURL('image/png');
    document.getElementsByTagName('head')[0].appendChild(iconLink);
}

const setIcon = () => {
    updateIcon(96);
    updateIcon(256);
    updateTouchIcon(256);
};

export {
    setIcon,
};
