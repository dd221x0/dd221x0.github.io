import { 
    getCurrentColorString,
    defaultColorString,
} from './common.js';

const pngIconSize = 256;

const x1 = 0.8535533905932737;
const y1 = 0.14644660940672627;
const x2 = 0.6294095225512604;
const y2 = 0.9829629131445341;
const x3 = 0.017037086855465844;
const y3 = 0.37059047744873963;

const getSvgIconData = () => {
    const colorString = getCurrentColorString();

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
        <path d="M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z" fill="${colorString}" />
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const getCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = pngIconSize;
    canvas.height = pngIconSize;
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

    canvasContext.fillStyle = getCurrentColorString();
    canvasContext.beginPath();
    canvasContext.moveTo(x1scaled, y1scaled);
    canvasContext.lineTo(x2scaled, y2scaled);
    canvasContext.lineTo(x3scaled, y3scaled);
    canvasContext.fill();
};

const isDefaultIcon = (iconLink) => getCurrentColorString() === defaultColorString
    && iconLink?.href.startsWith(`${location.origin}/icon.`);

const updateIcon = () => {
    let iconLink = document.querySelector('link[rel="icon"][type="image/svg+xml"]');

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

const updatePngIcon = (rel) => {
    let iconLink = document.querySelector(`link[rel="${rel}"][type="image/png"]`);

    if (isDefaultIcon(iconLink)) {
        return;
    }

    const canvas = getCanvas();
    drawTriangle(canvas);
    const pngData = canvas.toDataURL('image/png');

    if (iconLink) {
        iconLink.href = pngData;
        return;
    }

    iconLink = document.createElement('link');
    iconLink.rel = rel;
    iconLink.href = pngData;
    iconLink.type = 'image/png';
    iconLink.sizes = `${canvas.width}x${canvas.height}`;
    document.getElementsByTagName('head')[0].appendChild(iconLink);
}

const setIcon = () => {
    updateIcon();
    updatePngIcon('icon');
    updatePngIcon('apple-touch-icon');
};

export {
    setIcon,
};
