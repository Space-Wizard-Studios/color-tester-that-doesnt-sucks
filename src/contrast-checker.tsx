import React, { useState, useCallback } from 'react';
import { Check, X, Plus } from 'lucide-react';
import { SketchPicker } from 'react-color';
import { oklchToRgb, rgbToOklch, rgbToHex, rgbToCss, calculateContrast } from './utils';
import { RGB } from './types/RGB';

interface Color { id: number; name: string; l: number; c: number; h: number; a?: number }
type SelectedColor = { type: 'foreground' | 'background'; id: number };

// sub components moved to top-level to keep stable identity across renders
const ComplianceIndicator: React.FC<{ passes: boolean }> = ({ passes }) => (
  passes ? (
    <Check className="w-4 h-4 text-green-600" />
  ) : (
    <X className="w-4 h-4 text-red-600" />
  )
);

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

const ColorCard: React.FC<ColorCardProps> = ({ color, type, isSelected, onSelect, onRemove, canRemove, updateForeground, updateBackground }) => {
  const [localName, setLocalName] = useState<string>(color.name);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const rgb = oklchToRgb(color.l, color.c, color.h);
  const css = rgbToCss(rgb, color.a ?? 1);

  React.useEffect(() => {
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
      className={`border-2 rounded-lg p-3 bg-white flex flex-col gap-3 shrink-0 w-32 cursor-pointer transition-colors relative ${isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
        }`}
      onClick={() => onSelect()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {canRemove && isHovered && (
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onRemove(); }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div
        className="w-full h-24 rounded border-2 border-gray-300 shrink-0"
        style={{ backgroundColor: css }}
      />

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

type ContrastResultProps = { fg: Color; bg: Color };

const ContrastResult: React.FC<ContrastResultProps> = ({ fg, bg }) => {
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
// ColorEditor as top-level component (stable identity)
type ColorEditorProps = {
  selectedColor: SelectedColor;
  foregrounds: Color[];
  backgrounds: Color[];
  updateForeground: (id: number, updates: Partial<Color>) => void;
  updateBackground: (id: number, updates: Partial<Color>) => void;
};

const ColorEditorTop: React.FC<ColorEditorProps> = ({ selectedColor, foregrounds, backgrounds, updateForeground, updateBackground }) => {
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
    const rgbColor: RGB = { r: color.rgb.r, g: color.rgb.g, b: color.rgb.b };
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
          <label className="text-sm font-medium text-gray-700 block mb-2">OKLCH</label>
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
        </div>
      </div>
    </div>
  );
};

// Main component
const ContrastChecker: React.FC = () => {
  const [foregrounds, setForegrounds] = useState<Color[]>([
    { id: 1, name: 'Dark Blue', l: 0.3, c: 0.1, h: 250 }
  ]);
  const [backgrounds, setBackgrounds] = useState<Color[]>([
    { id: 1, name: 'Light Gray', l: 0.95, c: 0.02, h: 250 }
  ]);
  const [selectedColor, setSelectedColor] = useState<SelectedColor>({ type: 'foreground', id: 1 });
  const [nextId, setNextId] = useState<number>(2);

  const addForeground = () => {
    const newColor = { id: nextId, name: `Foreground ${nextId}`, l: 0.3, c: 0.1, h: Math.floor(Math.random() * 360) };
    setForegrounds(prev => [...prev, newColor]);
    setSelectedColor({ type: 'foreground', id: nextId });
    setNextId(prev => prev + 1);
  };

  const addBackground = () => {
    const newColor = { id: nextId, name: `Background ${nextId}`, l: 0.95, c: 0.02, h: Math.floor(Math.random() * 360) };
    setBackgrounds(prev => [...prev, newColor]);
    setSelectedColor({ type: 'background', id: nextId });
    setNextId(prev => prev + 1);
  };

  const updateForeground = useCallback((id: number, updates: Partial<Color>) => {
    setForegrounds(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const updateBackground = useCallback((id: number, updates: Partial<Color>) => {
    setBackgrounds(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const removeForeground = useCallback((id: number) => {
    setForegrounds(prev => {
      if (prev.length <= 1) return prev;
      const newList = prev.filter(c => c.id !== id);
      if (selectedColor.type === 'foreground' && selectedColor.id === id) {
        const first = newList[0];
        if (first) setSelectedColor({ type: 'foreground', id: first.id });
      }
      return newList;
    });
  }, [selectedColor]);

  const removeBackground = useCallback((id: number) => {
    setBackgrounds(prev => {
      if (prev.length <= 1) return prev;
      const newList = prev.filter(c => c.id !== id);
      if (selectedColor.type === 'background' && selectedColor.id === id) {
        const first = newList[0];
        if (first) setSelectedColor({ type: 'background', id: first.id });
      }
      return newList;
    });
  }, [selectedColor]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">WCAG Contrast Ratio Checker</h1>
              <p className="text-gray-600">Test multiple color combinations for WCAG 2+ accessibility compliance</p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Foregrounds</h2>
                  <button onClick={addForeground} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 pt-3">
                  {foregrounds.map(fg => (
                    <ColorCard
                      key={fg.id}
                      color={fg}
                      type="foreground"
                      isSelected={selectedColor.type === 'foreground' && selectedColor.id === fg.id}
                      onSelect={() => setSelectedColor({ type: 'foreground', id: fg.id })}
                      onRemove={() => removeForeground(fg.id)}
                      canRemove={foregrounds.length > 1}
                      updateForeground={updateForeground}
                      updateBackground={updateBackground}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Backgrounds</h2>
                  <button onClick={addBackground} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 pt-3">
                  {backgrounds.map(bg => (
                    <ColorCard
                      key={bg.id}
                      color={bg}
                      type="background"
                      isSelected={selectedColor.type === 'background' && selectedColor.id === bg.id}
                      onSelect={() => setSelectedColor({ type: 'background', id: bg.id })}
                      onRemove={() => removeBackground(bg.id)}
                      canRemove={backgrounds.length > 1}
                      updateForeground={updateForeground}
                      updateBackground={updateBackground}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contrast Results ({foregrounds.length} × {backgrounds.length} = {foregrounds.length * backgrounds.length} combinations)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foregrounds.map(fg => backgrounds.map(bg => (
                    <ContrastResult key={`${fg.id}-${bg.id}`} fg={fg} bg={bg} />
                  )))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
          <ColorEditorTop selectedColor={selectedColor} foregrounds={foregrounds} backgrounds={backgrounds} updateForeground={updateForeground} updateBackground={updateBackground} />
        </div>
      </div>
    </div>
  );
};

export default ContrastChecker;