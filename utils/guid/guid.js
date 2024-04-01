const generateSegment = (length) => Array(length)
    .fill(0)
    .map(() => Math.floor(Math.random() * 0x10).toString(0x10))
    .join('');

const generateVariant = () => (Math.floor(Math.random() * 0x4) + 0x8).toString(0x10);

export const generateGuid = () => (
    generateSegment(8) +
    '-' +
    generateSegment(4) +
    '-' +
    `4${generateSegment(3)}` +
    '-' +
    `${generateVariant()}${generateSegment(3)}` +
    '-' +
    generateSegment(12)
);