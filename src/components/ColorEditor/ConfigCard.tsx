import React from 'react';
import type { VisualConfig, Color } from '../../types/Color';
import { oklchToRgb, rgbToCss, applyVisualConfig } from '../../utils';

type Props = {
    config: VisualConfig;
    onChange: (next: VisualConfig) => void;
    onReset: () => void;
    foregrounds: Color[];
    backgrounds: Color[];
};

export const ConfigCard: React.FC<Props> = ({ config, onChange, onReset, foregrounds, backgrounds }) => {
    const update = (patch: Partial<VisualConfig>) => onChange({ ...config, ...patch });

    const toCss = (c: Color) => {
        const raw = oklchToRgb(c.l, c.c, c.h);
        const transformed = config ? applyVisualConfig(raw, config) : raw;
        return rgbToCss(transformed, c.a ?? 1);
    };

    return (
        <section className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Visual configuration</h3>
                <button type="button" onClick={onReset} className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Reset</button>
            </div>

            <div className="space-y-4 text-sm">
                <div>
                    <label htmlFor="gamma-range" className="block mb-1">Gamma correction: {config.gamma.toFixed(2)}</label>
                    <div className="flex items-center gap-2">
                        <input id="gamma-range" type="range" min="0.1" max="3" step="0.01" value={config.gamma} onChange={(e) => update({ gamma: Number(e.target.value) })} className="flex-1" />
                        <input aria-label="Gamma value" id="gamma-number" type="number" min="0.1" max="3" step="0.01" value={config.gamma} onChange={(e) => update({ gamma: Number(e.target.value) })} className="w-20 ml-2 border rounded px-2 py-1 text-sm" />
                    </div>
                </div>

                <div>
                    <label htmlFor="contrast-range" className="block mb-1">Contrast correction: {config.contrast.toFixed(2)}</label>
                    <div className="flex items-center gap-2">
                        <input id="contrast-range" type="range" min="0" max="3" step="0.01" value={config.contrast} onChange={(e) => update({ contrast: Number(e.target.value) })} className="flex-1" />
                        <input aria-label="Contrast value" id="contrast-number" type="number" min="0" max="3" step="0.01" value={config.contrast} onChange={(e) => update({ contrast: Number(e.target.value) })} className="w-20 ml-2 border rounded px-2 py-1 text-sm" />
                    </div>
                </div>

                <div>
                    <label htmlFor="protanopia-range" className="block mb-1">Protanopia strength: {Math.round(config.protanopia * 100)}%</label>
                    <div className="flex items-center gap-2">
                        <input id="protanopia-range" type="range" min="0" max="1" step="0.01" value={config.protanopia} onChange={(e) => update({ protanopia: Number(e.target.value) })} className="flex-1" />
                        <input aria-label="Protanopia strength" id="protanopia-number" type="number" min="0" max="1" step="0.01" value={config.protanopia} onChange={(e) => update({ protanopia: Number(e.target.value) })} className="w-20 ml-2 border rounded px-2 py-1 text-sm" />
                    </div>
                </div>

                <div>
                    <label htmlFor="deuteranopia-range" className="block mb-1">Deuteranopia strength: {Math.round(config.deuteranopia * 100)}%</label>
                    <div className="flex items-center gap-2">
                        <input id="deuteranopia-range" type="range" min="0" max="1" step="0.01" value={config.deuteranopia} onChange={(e) => update({ deuteranopia: Number(e.target.value) })} className="flex-1" />
                        <input aria-label="Deuteranopia strength" id="deuteranopia-number" type="number" min="0" max="1" step="0.01" value={config.deuteranopia} onChange={(e) => update({ deuteranopia: Number(e.target.value) })} className="w-20 ml-2 border rounded px-2 py-1 text-sm" />
                    </div>
                </div>

                <div>
                    <label htmlFor="tritanopia-range" className="block mb-1">Tritanopia strength: {Math.round(config.tritanopia * 100)}%</label>
                    <div className="flex items-center gap-2">
                        <input id="tritanopia-range" type="range" min="0" max="1" step="0.01" value={config.tritanopia} onChange={(e) => update({ tritanopia: Number(e.target.value) })} className="flex-1" />
                        <input aria-label="Tritanopia strength" id="tritanopia-number" type="number" min="0" max="1" step="0.01" value={config.tritanopia} onChange={(e) => update({ tritanopia: Number(e.target.value) })} className="w-20 ml-2 border rounded px-2 py-1 text-sm" />
                    </div>
                </div>

                <div>
                    <div className="block mb-2 font-medium">Foreground colors</div>
                    <ul className="flex flex-wrap gap-1" aria-label="Foreground colors">
                        {foregrounds.map((c) => (
                            <li key={c.id} className="flex items-center gap-1 p-1 rounded bg-white list-none">
                                <div key={c.id} title={c.name} aria-label={c.name} className="w-6 h-6 rounded" style={{ background: toCss(c) }} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="block mb-2 font-medium">Backgrounds colors</div>
                    <ul className="flex flex-wrap gap-1" aria-label="Backgrounds colors">
                        {backgrounds.map((c) => (
                            <li key={c.id} className="flex items-center gap-1 p-1 rounded bg-white list-none">
                                <div key={c.id} title={c.name} aria-label={c.name} className="w-6 h-6 rounded" style={{ background: toCss(c) }} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ConfigCard;
