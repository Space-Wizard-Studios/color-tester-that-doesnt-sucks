import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { oklchToRgb, rgbToCss } from '../utils';
import type { Color } from '../types/Color';

type ColorCardProps = {
    color: Color;
    type: 'foreground' | 'background';
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
    canRemove: boolean;
    updateForeground: (id: number, updates: Partial<Color>) => void;
    updateBackground: (id: number, updates: Partial<Color>) => void;
};

export const ColorCard: React.FC<ColorCardProps> = ({ color, type, isSelected, onSelect, onRemove, canRemove, updateForeground, updateBackground }) => {
    const [localName, setLocalName] = useState<string>(color.name);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const rgb = oklchToRgb(color.l, color.c, color.h);
    const css = rgbToCss(rgb, color.a ?? 1);

    useEffect(() => {
        setLocalName(color.name);
    }, [color.name]);

    const handleNameBlur = () => {
        if (localName !== color.name) {
            if (type === 'foreground') {
                updateForeground(color.id, { name: localName });
            } else {
                updateBackground(color.id, { name: localName });
            }
        }
    };

    return (
        <div
            className={`border-2 rounded-lg p-3 bg-white flex flex-col gap-3 shrink-0 w-32 transition-colors relative ${isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
        >
            {canRemove && isHovered && (
                <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onRemove(); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            <button
                type="button"
                onClick={() => onSelect()}
                aria-pressed={isSelected}
                className="w-full h-24 rounded border-2 border-gray-300 shrink-0 p-0"
                style={{ backgroundColor: css }}
                onFocus={() => setIsHovered(true)}
                onBlur={() => setIsHovered(false)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={() => setIsHovered(false)}
            >
                <span className="sr-only">Select {color.name}</span>
            </button>

            <input
                type="text"
                value={localName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalName(e.target.value)}
                onBlur={handleNameBlur}
                onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                className="w-full text-sm font-medium text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1 text-center"
            />
        </div>
    );
};

export default ColorCard;
