import React from 'react';
import { oklchToRgb, calculateContrast, rgbToHex, rgbToCss } from '../utils';
import { ComplianceIndicator } from './ComplianceIndicator';
import type { Color } from '../types/Color';

type ContrastResultProps = { fg: Color; bg: Color };

export const ContrastResult: React.FC<ContrastResultProps> = ({ fg, bg }) => {
    const fgRgb = oklchToRgb(fg.l, fg.c, fg.h);
    const bgRgb = oklchToRgb(bg.l, bg.c, bg.h);
    const contrast = calculateContrast(fgRgb, bgRgb);
    const fgHex = rgbToHex(fgRgb);
    const bgHex = rgbToHex(bgRgb);
    const fgCss = rgbToCss(fgRgb, fg.a ?? 1);
    const bgCss = rgbToCss(bgRgb, bg.a ?? 1);

    const compliance = {
        aa: {
            normal: contrast >= 4.5,
            large: contrast >= 3
        },
        aaa: {
            normal: contrast >= 7,
            large: contrast >= 4.5
        }
    };

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
                    <div className="text-2xl font-bold text-gray-900">
                        {contrast.toFixed(2)}:1
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
