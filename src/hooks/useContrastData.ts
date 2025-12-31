import { useMemo } from 'react';
import type { Color, VisualConfig, RGB } from '../types/Color';
import { oklchToRgb, applyVisualConfig, calculateContrast, rgbToHex, rgbToCss } from '../utils';
import { deltaEoklch, checkNonTextContrast, checkIconContrast, simulateAndCheck, evaluateAmbientVariants, checkChromaticVibration } from '../utils/contrastChecks';

export type ContrastData = {
    fgRgb: RGB;
    bgRgb: RGB;
    fgAdj: RGB;
    bgAdj: RGB;
    fgHex: string;
    bgHex: string;
    fgCss: string;
    bgCss: string;
    compliance: {
        aa: { normal: boolean; large: boolean };
        aaa: { normal: boolean; large: boolean };
    };
    contrastOriginal: number;
    contrastSimulated: number;
    nonTextOriginal: boolean;
    nonTextSimulated: boolean;
    iconOriginal: boolean;
    iconSimulated: boolean;
    simulatedSummary: { originalContrast: number; simulatedContrast: number; simulatedPass: boolean };
    delta: number;
    deltaNorm: number;
    deltaLabel: string;
    deltaPass: boolean;
    chromaticVibration: boolean;
    ambient: { worstContrast: number; worstVariant: Partial<VisualConfig> | null };
    ambientPass: boolean;
    examples: { deltaBW: number; deltaBG: number; deltaBWNorm: number; deltaBGNorm: number };
};

export const useContrastData = (fg: Color, bg: Color, visualConfig?: VisualConfig): ContrastData => {
    return useMemo(() => {
        const fgRgb = oklchToRgb(fg.l, fg.c, fg.h);
        const bgRgb = oklchToRgb(bg.l, bg.c, bg.h);
        const fgAdj = visualConfig ? applyVisualConfig(fgRgb, visualConfig) : fgRgb;
        const bgAdj = visualConfig ? applyVisualConfig(bgRgb, visualConfig) : bgRgb;

        const contrastOriginal = calculateContrast(fgRgb, bgRgb);
        const contrastSimulated = calculateContrast(fgAdj, bgAdj);

        const fgHex = rgbToHex(fgRgb);
        const bgHex = rgbToHex(bgRgb);
        const fgCss = rgbToCss(fgAdj, fg.a ?? 1);
        const bgCss = rgbToCss(bgAdj, bg.a ?? 1);

        const compliance = {
            aa: { normal: contrastOriginal >= 4.5, large: contrastOriginal >= 3 },
            aaa: { normal: contrastOriginal >= 7, large: contrastOriginal >= 4.5 }
        };

        const nonTextOriginal = checkNonTextContrast(fgRgb, bgRgb);
        const nonTextSimulated = checkNonTextContrast(fgAdj, bgAdj);
        const iconOriginal = checkIconContrast(fgRgb, bgRgb);
        const iconSimulated = checkIconContrast(fgAdj, bgAdj);

        const simulatedSummary = simulateAndCheck(fgRgb, bgRgb, visualConfig, 3);

        const delta = deltaEoklch(fgRgb, bgRgb);
        const maxDelta = deltaEoklch({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }) || 1;
        const deltaNorm = delta / maxDelta;
        const deltaLabel = deltaNorm < 0.05 ? 'Very similar' : (deltaNorm < 0.2 ? 'Similar' : 'Distinct');
        const deltaPass = deltaNorm >= 0.2;

        const chromaticVibration = checkChromaticVibration(fgRgb, bgRgb);

        // Avoid degenerate preset that sets contrast to 0 (neutralizes both colors to mid-gray)
        // which will always produce contrast == 1 and is not a useful worst-case for accessibility checks.
        const ambientPresets: Partial<VisualConfig>[] = [
            { gamma: 0.8, contrast: 0.8 },
            { gamma: 1.2, contrast: 1.2 },
            { gamma: 1, contrast: 0.9 }
        ];
        const ambient = evaluateAmbientVariants(fgRgb, bgRgb, ambientPresets);
        const ambientPass = typeof ambient.worstContrast === 'number' ? ambient.worstContrast >= 3 : false;

        const exampleBlack = { r: 0, g: 0, b: 0 } as RGB;
        const exampleWhite = { r: 255, g: 255, b: 255 } as RGB;
        const exampleBlue = { r: 0, g: 0, b: 255 } as RGB;
        const exampleGreen = { r: 0, g: 255, b: 0 } as RGB;
        const deltaBW = deltaEoklch(exampleBlack, exampleWhite);
        const deltaBG = deltaEoklch(exampleBlue, exampleGreen);
        const deltaBWNorm = deltaBW / maxDelta;
        const deltaBGNorm = deltaBG / maxDelta;

        return {
            fgRgb,
            bgRgb,
            fgAdj,
            bgAdj,
            fgHex,
            bgHex,
            fgCss,
            bgCss,
            contrastOriginal,
            contrastSimulated,
            compliance,
            nonTextOriginal,
            nonTextSimulated,
            iconOriginal,
            iconSimulated,
            simulatedSummary,
            delta,
            deltaPass,
            deltaNorm,
            deltaLabel,
            chromaticVibration,
            ambient,
            ambientPass,
            examples: { deltaBW, deltaBG, deltaBWNorm, deltaBGNorm }
        };
    }, [fg, bg, visualConfig]);
};

export default useContrastData;
