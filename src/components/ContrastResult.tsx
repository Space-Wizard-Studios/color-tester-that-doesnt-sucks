import React from 'react';
import { oklchToRgb, calculateContrast, rgbToHex, rgbToCss, applyVisualConfig } from '../utils';
import { checkNonTextContrast, checkIconContrast, deltaEoklch, simulateAndCheck, evaluateAmbientVariants, checkChromaticVibration } from '../utils/contrastChecks';
import { ComplianceIndicator } from './ComplianceIndicator';
import type { Color, VisualConfig } from '../types/Color';

type ContrastResultProps = { fg: Color; bg: Color; visualConfig?: VisualConfig };

export const ContrastResult: React.FC<ContrastResultProps> = ({ fg, bg, visualConfig }) => {
    const fgRgb = oklchToRgb(fg.l, fg.c, fg.h);
    const bgRgb = oklchToRgb(bg.l, bg.c, bg.h);
    // Apply visual adjustments (simulation) if provided
    const fgAdj = visualConfig ? applyVisualConfig(fgRgb, visualConfig) : fgRgb;
    const bgAdj = visualConfig ? applyVisualConfig(bgRgb, visualConfig) : bgRgb;
    // contrastOriginal: used for WCAG compliance checks
    const contrastOriginal = calculateContrast(fgRgb, bgRgb);
    // contrastSimulated: perceived contrast after visual adjustments
    const contrastSimulated = calculateContrast(fgAdj, bgAdj);
    const fgHex = rgbToHex(fgRgb);
    const bgHex = rgbToHex(bgRgb);
    const fgCss = rgbToCss(fgAdj, fg.a ?? 1);
    const bgCss = rgbToCss(bgAdj, bg.a ?? 1);

    const compliance = {
        aa: {
            normal: contrastOriginal >= 4.5,
            large: contrastOriginal >= 3
        },
        aaa: {
            normal: contrastOriginal >= 7,
            large: contrastOriginal >= 4.5
        }
    };

    // Non-text / icon checks (WCAG 1.4.11 threshold 3:1)
    const nonTextOriginal = checkNonTextContrast(fgRgb, bgRgb);
    const nonTextSimulated = checkNonTextContrast(fgAdj, bgAdj);
    const iconOriginal = checkIconContrast(fgRgb, bgRgb);
    const iconSimulated = checkIconContrast(fgAdj, bgAdj);

    // Delta-E perceptual difference (OKLCH-derived)
    const delta = deltaEoklch(fgRgb, bgRgb);
    // Normalize ΔE against the black-white maximum in OKLab/OKLCH space
    const maxDelta = deltaEoklch({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }) || 1;
    const deltaNorm = delta / maxDelta; // 0..1
    // Use normalized thresholds (fraction of black-white distance)
    // These are empirical: <5% = very similar (fail), <20% = similar (warn)
    const deltaFail = deltaNorm < 0.05;
    const deltaWarn = deltaNorm < 0.2;
    // Textual label for quick reading
    const deltaLabel = deltaFail ? 'Very similar' : (deltaWarn ? 'Similar' : 'Distinct');

    // Example reference deltas to help validate thresholds
    const exampleBlack = { r: 0, g: 0, b: 0 };
    const exampleWhite = { r: 255, g: 255, b: 255 };
    const exampleBlue = { r: 0, g: 0, b: 255 };
    const exampleGreen = { r: 0, g: 255, b: 0 };
    const deltaBW = deltaEoklch(exampleBlack, exampleWhite);
    const deltaBG = deltaEoklch(exampleBlue, exampleGreen);
    const deltaBWNorm = deltaBW / maxDelta;
    const deltaBGNorm = deltaBG / maxDelta;
    // Chromatic vibration (flagging highly saturated, mid-hue-difference pairs)
    const chromaticVibration = checkChromaticVibration(fgRgb, bgRgb);

    // Simulated pass/fail (uses threshold 3 for non-text/icon)
    const simulatedSummary = simulateAndCheck(fgRgb, bgRgb, visualConfig, 3);

    // Ambient/gamma presets to evaluate worst-case
    const ambientPresets: Partial<any>[] = [
        { gamma: 0.8, contrast: 0.8 },
        { gamma: 1.2, contrast: 1.2 },
        { gamma: 1, contrast: 0 },
    ];
    const ambient = evaluateAmbientVariants(fgRgb, bgRgb, ambientPresets as any);

    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: fgHex }}
                        title={fg.name}
                    />
                    <span className="text-sm text-gray-600">on</span>
                    <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: bgHex }}
                        title={bg.name}
                    />
                </div>
                <div className="flex-1">
                    <div className="text-2xl font-bold text-gray-900 flex items-baseline gap-3">
                        <span>{contrastOriginal.toFixed(2)}:1</span>
                        <span className="text-xs text-gray-500">(WCAG)</span>
                        <span className="ml-2 text-sm px-2 py-0.5 bg-gray-100 rounded" title="Simulated contrast shows perceived contrast after applying the visual adjustments (gamma/contrast and color-deficiency). WCAG compliance is calculated from the original colors.">
                            Sim: {contrastSimulated.toFixed(2)}:1
                        </span>
                        <div className="ml-3 flex items-center gap-2">
                            <span className={nonTextOriginal ? 'text-green-700 text-xs' : 'text-red-700 text-xs'} title="Non-text (UI) original: 3:1">
                                Non-text: {nonTextOriginal ? 'pass' : 'fail'}
                            </span>
                            <span className={iconOriginal ? 'text-green-700 text-xs' : 'text-red-700 text-xs'} title="Icon contrast original: 3:1">
                                Icon: {iconOriginal ? 'pass' : 'fail'}
                            </span>
                            <span className={simulatedSummary.simulatedPass ? 'text-green-700 text-xs' : 'text-red-700 text-xs'} title="Simulated non-text/icon pass (uses visual simulation)">
                                SimPass: {simulatedSummary.simulatedPass ? 'yes' : 'no'}
                            </span>
                            <span className={deltaFail ? 'text-red-700 text-xs' : (deltaWarn ? 'text-yellow-700 text-xs' : 'text-green-700 text-xs')} title={`Delta-E OKLCH: ${delta.toFixed(3)} — normalized ${(deltaNorm*100).toFixed(1)}% of black↔white (lower = more similar)`}>
                                {delta.toFixed(3)}
                            </span>
                            <span className="text-xs ml-1 font-medium" title="Interpretation">{deltaLabel}</span>
                            <span className="text-xs text-gray-400 ml-2" title="Examples: black/white, blue/green">Ex: B/W {deltaBW.toFixed(3)} ({(deltaBWNorm*100).toFixed(0)}%), Blue/Green {deltaBG.toFixed(3)} ({(deltaBGNorm*100).toFixed(0)}%)</span>
                            {chromaticVibration && (
                                <span className="text-yellow-700 text-xs ml-2" title="High saturation + mid hue difference — may cause visual vibration (uncomfortable to read)">Vibration: yes</span>
                            )}
                            <span className="text-xs text-gray-500" title="Worst-case contrast found across ambient/gamma presets">Amb: {ambient.worstContrast ? ambient.worstContrast.toFixed(2) : '—'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                <div>
                    <div className="font-medium text-gray-700 mb-1">AA (Minimum)</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ComplianceIndicator passes={compliance.aa.normal} />
                            <span className={compliance.aa.normal ? "text-green-700" : "text-red-700"}>
                                Normal (4.5:1)
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ComplianceIndicator passes={compliance.aa.large} />
                            <span className={compliance.aa.large ? "text-green-700" : "text-red-700"}>
                                Large (3:1)
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="font-medium text-gray-700 mb-1">AAA (Enhanced)</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ComplianceIndicator passes={compliance.aaa.normal} />
                            <span className={compliance.aaa.normal ? "text-green-700" : "text-red-700"}>
                                Normal (7:1)
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ComplianceIndicator passes={compliance.aaa.large} />
                            <span className={compliance.aaa.large ? "text-green-700" : "text-red-700"}>
                                Large (4.5:1)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div
                    className="p-3 rounded text-sm"
                    style={{ backgroundColor: bgCss, color: fgCss }}
                >
                    Sample text
                </div>
                <div
                    className="p-3 rounded text-lg font-bold"
                    style={{ backgroundColor: bgCss, color: fgCss }}
                >
                    Large
                </div>
            </div>
        </div>
    );
};

export default ContrastResult;
