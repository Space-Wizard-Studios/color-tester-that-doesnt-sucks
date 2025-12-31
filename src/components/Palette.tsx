import React from 'react';
import { Plus } from 'lucide-react';
import { ColorCard } from './ColorCard';
import type { Color, VisualConfig } from '../types/Color';

type PaletteProps = {
    title: string;
    type: 'foreground' | 'background';
    colors: Color[];
    selectedId: number;
    onSelect: (id: number) => void;
    onAdd: () => void;
    onRemove: (id: number) => void;
    updateForeground: (id: number, updates: Partial<Color>) => void;
    updateBackground: (id: number, updates: Partial<Color>) => void;
    visualConfig?: VisualConfig;
};

export const Palette: React.FC<PaletteProps> = ({ title, type, colors, selectedId, onSelect, onAdd, onRemove, updateForeground, updateBackground, visualConfig }) => (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button onClick={onAdd} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                <Plus className="w-4 h-4" />
                Add
            </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 pt-3">
            {colors.map(c => (
                <ColorCard
                    key={c.id}
                    color={c}
                    type={type}
                    isSelected={selectedId === c.id}
                    onSelect={() => onSelect(c.id)}
                    onRemove={() => onRemove(c.id)}
                    canRemove={colors.length > 1}
                    updateForeground={updateForeground}
                    updateBackground={updateBackground}
                    visualConfig={visualConfig}
                />
            ))}
        </div>
    </div>
);

export default Palette;
