import { 
    getCurrentColorPair,
    defaultColorPair,
} from './common.js';

const defaultIconLinkHref = `${location.origin}/icon.png`;

const ICON_SIZE = 64;

const getCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = ICON_SIZE;
    canvas.height = ICON_SIZE;
    return canvas;
};

const drawTriangle = (canvas) => {
    const canvasContext = canvas.getContext('2d');

    canvasContext.drawImage(new Image(), 0, 0);
    canvasContext.clearRect(0, 0, ICON_SIZE, ICON_SIZE);

    const x1 = 62.528428594767185;
    const y1 = 0.7091757122668199;
    const x2 = 45.964009708205865;
    const y2 = 62.528428594767185;
    const x3 = 0.7091757122668199;
    const y3 = 17.27359459882815;

    canvasContext.fillStyle = getCurrentColorPair().color;
    canvasContext.beginPath();
    canvasContext.moveTo(x1, y1);
    canvasContext.lineTo(x2, y2);
    canvasContext.lineTo(x3, y3);
    canvasContext.fill();
};

const isDefaultIcon = (iconLink) => getCurrentColorPair().color === defaultColorPair.color
    && iconLink?.href === defaultIconLinkHref;

const setIcon = () => {
    const iconLink = document.querySelector('link[rel="icon"]');

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
    iconLink.rel = 'icon';
    iconLink.type = 'image/png';
    iconLink.sizes = `${canvas.width}x${canvas.height}`;
    iconLink.href = canvas.toDataURL('image/png');
    document.getElementsByTagName('head')[0].appendChild(iconLink);
};

export {
    setIcon,
};
