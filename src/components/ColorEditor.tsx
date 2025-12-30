import React from 'react';
import { SketchPicker } from 'react-color';
import { oklchToRgb, rgbToOklch } from '../utils';
import type { Color, SelectedColor } from '../types/Color';

type ColorEditorProps = {
    selectedColor: SelectedColor;
    foregrounds: Color[];
    backgrounds: Color[];
    updateForeground: (id: number, updates: Partial<Color>) => void;
    updateBackground: (id: number, updates: Partial<Color>) => void;
};

export const ColorEditor: React.FC<ColorEditorProps> = ({ selectedColor, foregrounds, backgrounds, updateForeground, updateBackground }) => {
    const currentColor = selectedColor.type === 'foreground'
        ? foregrounds.find(c => c.id === selectedColor.id)
        : backgrounds.find(c => c.id === selectedColor.id);

    if (!currentColor) return null;

    const rgb = oklchToRgb(currentColor.l, currentColor.c, currentColor.h);

    const updateColor = (updates: Partial<Color>) => {
        if (selectedColor.type === 'foreground') {
            updateForeground(selectedColor.id, updates);
        } else {
            updateBackground(selectedColor.id, updates);
        }
    };

    const handleColorPickerChange = (color: any) => {
        const rgbColor = { r: color.rgb.r, g: color.rgb.g, b: color.rgb.b };
        const oklch = rgbToOklch(rgbColor);
        updateColor({ l: oklch.l, c: oklch.c, h: oklch.h, a: color.rgb.a });
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Color Editor</h2>

            <div className="text-sm text-gray-600 mb-4">
                {selectedColor.type === 'foreground' ? 'Foreground' : 'Background'}: <span className="font-medium">{currentColor.name}</span>
            </div>

            <div className="mb-6">
                <SketchPicker
                    color={{ r: rgb.r, g: rgb.g, b: rgb.b, a: currentColor.a ?? 1 }}
                    onChange={handleColorPickerChange}
                    disableAlpha={false}
                    styles={{ default: { picker: { width: '100%', boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: '8px' } } }}
                />
            </div>

            <div className="space-y-4">
                <div>
                    <fieldset className="p-0 m-0 border-0">
                        <legend className="text-sm font-medium text-gray-700 block mb-2">OKLCH</legend>
                        <div className="space-y-2">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">L</div>
                                <input type="range" min="0" max="1" step="0.01" value={currentColor.l} onChange={(e) => updateColor({ l: Number(e.target.value) })} />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">C</div>
                                <input type="range" min="0" max="0.6" step="0.01" value={currentColor.c} onChange={(e) => updateColor({ c: Number(e.target.value) })} />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">H</div>
                                <input type="range" min="0" max="360" step="1" value={currentColor.h} onChange={(e) => updateColor({ h: Number(e.target.value) })} />
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
    );
};

export default ColorEditor;
