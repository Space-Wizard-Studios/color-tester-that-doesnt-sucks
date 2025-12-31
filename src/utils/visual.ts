import type { VisualConfig } from '../types/Color';

type RGB = { r: number; g: number; b: number };

type Matrix3 = [
    [number, number, number],
    [number, number, number],
    [number, number, number]
];

const clamp = (v: number, a = 0, b = 255) => Math.min(b, Math.max(a, v));

export const applyGamma = (rgb: RGB, gamma: number): RGB => {
    if (gamma === 1 || gamma === undefined || gamma === null) return rgb;
    if (gamma <= 0) return rgb;
    const apply = (v: number) => clamp(Math.pow(v / 255, 1 / gamma) * 255);
    return { r: apply(rgb.r), g: apply(rgb.g), b: apply(rgb.b) };
};

export const applyContrast = (rgb: RGB, contrast: number): RGB => {
    if (contrast === 1 || contrast === undefined || contrast === null) return rgb;
    // Special case: treat contrast === 0 as neutralizing the color to a mid gray
    if (contrast === 0) {
        const mid = 128;
        return { r: mid, g: mid, b: mid };
    }
    const apply = (v: number) => clamp((v - 128) * contrast + 128);
    return { r: apply(rgb.r), g: apply(rgb.g), b: apply(rgb.b) };
};

const applyMatrix = (rgb: RGB, m: Matrix3): RGB => {
    const r = (m[0][0] * rgb.r) + (m[0][1] * rgb.g) + (m[0][2] * rgb.b);
    const g = (m[1][0] * rgb.r) + (m[1][1] * rgb.g) + (m[1][2] * rgb.b);
    const b = (m[2][0] * rgb.r) + (m[2][1] * rgb.g) + (m[2][2] * rgb.b);
    return { r: clamp(r), g: clamp(g), b: clamp(b) };
};

// Approximate simulation matrices for color vision deficiencies
const MATRICES: Record<'protanopia' | 'deuteranopia' | 'tritanopia', Matrix3> = {
    protanopia: [
        [0.567, 0.433, 0.0],
        [0.558, 0.442, 0.0],
        [0.0, 0.242, 0.758]
    ],
    deuteranopia: [
        [0.625, 0.375, 0.0],
        [0.7, 0.3, 0.0],
        [0.0, 0.3, 0.7]
    ],
    tritanopia: [
        [0.95, 0.05, 0.0],
        [0.0, 0.433, 0.567],
        [0.0, 0.475, 0.525]
    ]
};

export const simulateColorDeficiency = (rgb: RGB, type: 'protanopia' | 'deuteranopia' | 'tritanopia', strength: number): RGB => {
    if (!strength || strength <= 0) return rgb;
    const m = MATRICES[type];
    const simulated = applyMatrix(rgb, m);
    // interpolate between original and simulated by strength
    const mix = (a: number, b: number) => clamp(a * (1 - strength) + b * strength);
    return { r: mix(rgb.r, simulated.r), g: mix(rgb.g, simulated.g), b: mix(rgb.b, simulated.b) };
};

export const applyVisualConfig = (rgbInput: RGB, config?: VisualConfig): RGB => {
    if (!config) return rgbInput;
    let rgb = { ...rgbInput };
    rgb = applyGamma(rgb, config.gamma ?? 1);
    rgb = applyContrast(rgb, config.contrast ?? 1);
    if (config.protanopia && config.protanopia > 0) rgb = simulateColorDeficiency(rgb, 'protanopia', config.protanopia);
    if (config.deuteranopia && config.deuteranopia > 0) rgb = simulateColorDeficiency(rgb, 'deuteranopia', config.deuteranopia);
    if (config.tritanopia && config.tritanopia > 0) rgb = simulateColorDeficiency(rgb, 'tritanopia', config.tritanopia);
    return rgb;
};

export default {
    applyGamma,
    applyContrast,
    simulateColorDeficiency,
    applyVisualConfig
};
