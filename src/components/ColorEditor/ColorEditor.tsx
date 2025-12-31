import React from 'react';
import { oklchToRgb, rgbToOklch } from '../../utils';
import { ConfigCard } from './ConfigCard';
import { ColorPicker } from './ColorPicker';
import { OklchSliders } from '../OklchSliders';
import type { Color, SelectedColor, VisualConfig } from '../../types/Color';

type ColorEditorProps = {
    selectedColor: SelectedColor;
    foregrounds: Color[];
    backgrounds: Color[];
    updateForeground: (id: number, updates: Partial<Color>) => void;
    updateBackground: (id: number, updates: Partial<Color>) => void;
    visualConfig?: VisualConfig;
    onVisualChange?: (next: VisualConfig) => void;
    onVisualReset?: () => void;
};

export const ColorEditor: React.FC<ColorEditorProps> = ({ selectedColor, foregrounds, backgrounds, updateForeground, updateBackground, visualConfig, onVisualChange, onVisualReset }) => {
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

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Color Editor</h2>

            <div className="text-sm text-gray-600 mb-4">
                {selectedColor.type === 'foreground' ? 'Foreground' : 'Background'}: <span className="font-medium">{currentColor.name}</span>
            </div>

            <ColorPicker color={{ r: rgb.r, g: rgb.g, b: rgb.b, a: currentColor.a ?? 1 }} onChange={(c) => {
                const oklch = rgbToOklch({ r: c.r, g: c.g, b: c.b });
                updateColor({ l: oklch.l, c: oklch.c, h: oklch.h, a: c.a });
            }} />

            <div className="space-y-4">
                <OklchSliders color={currentColor} onChange={(u) => updateColor(u)} />
            </div>
            
            {/* Visual config placed at end of editor for convenient access */}
            {visualConfig && onVisualChange && onVisualReset && (
                <div className="mt-6">
                    <ConfigCard config={visualConfig} onChange={onVisualChange} onReset={onVisualReset} foregrounds={foregrounds} />
                </div>
            )}
        </div>
    );
};

export default ColorEditor;
