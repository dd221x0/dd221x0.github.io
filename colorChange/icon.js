import { 
    getCurrentColorPair,
    defaultColorPair,
} from './common.js';

const touchIconSize = 256;

const x1 = 0.9770066967932373;
const y1 = 0.01108087050416906;
const x2 = 0.7181876516907166;
const y2 = 0.9770066967932373;
const x3 = 0.01108087050416906;
const y3 = 0.26989991560668986;

const getSvgIconData = () => {
    const color = getCurrentColorPair().color;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
        <path d="M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z" fill="${color}" />
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const getCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = touchIconSize;
    canvas.height = touchIconSize;
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

const isDefaultIcon = (iconLink) => getCurrentColorPair().color === defaultColorPair.color
    && iconLink?.href.startsWith(`${location.origin}/icon.`);

const updateIcon = () => {
    let iconLink = document.querySelector(`link[rel="icon"]`);

    if (isDefaultIcon(iconLink)) {
        return;
    }

    const svgData = getSvgIconData();

    if (iconLink) {
        iconLink.href = svgData;
        return;
    }

    iconLink = document.createElement('link');
    iconLink.rel = 'icon';
    iconLink.href = svgData;
    iconLink.type = 'image/svg+xml';
    document.getElementsByTagName('head')[0].appendChild(iconLink);
}

const updateTouchIcon = () => {
    let iconLink = document.querySelector('link[rel="apple-touch-icon"]');

    if (isDefaultIcon(iconLink)) {
        return;
    }

    const canvas = getCanvas();
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
    updateIcon();
    updateTouchIcon();
};

export {
    setIcon,
};
