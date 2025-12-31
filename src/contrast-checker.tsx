import React, { useState, useCallback } from 'react';
import { Palette } from './components/Palette';
import { ContrastGrid } from './components/ContrastGrid';
import { ColorEditor } from './components/ColorEditor/ColorEditor';
import { Modal } from './components/Modal';
import type { Color, SelectedColor, VisualConfig } from './types/Color';

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

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const DEFAULT_VISUAL_CONFIG: VisualConfig = {
    gamma: 1,
    contrast: 1,
    protanopia: 0,
    deuteranopia: 0,
    tritanopia: 0,
  };

  const [visualConfig, setVisualConfig] = useState<VisualConfig>(DEFAULT_VISUAL_CONFIG);

  const resetVisualConfig = () => setVisualConfig({ ...DEFAULT_VISUAL_CONFIG });

  const selectColor = (type: SelectedColor['type'], id: number) => {
    setSelectedColor({ type, id });
    if (typeof globalThis !== 'undefined' && window.innerWidth < 768) {
      setIsEditorOpen(true);
    }
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
    <main className="min-h-screen flex flex-row bg-gray-50">

      <div className="flex-1 overflow-y-auto p-6 max-w-3/4">

        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contrast Checker That Doesn't Sucks (too much)</h1>
          <p className="text-gray-600">Test multiple color combinations for WCAG 2+ accessibility compliance</p>
        </header>

        <div className="space-y-6">

          <Palette
            title="Foregrounds"
            type="foreground"
            colors={foregrounds}
            selectedId={selectedColor.type === 'foreground' ? selectedColor.id : -1}
            onSelect={(id) => selectColor('foreground', id)}
            onAdd={addForeground}
            onRemove={removeForeground}
            updateForeground={updateForeground}
            updateBackground={updateBackground}
            visualConfig={visualConfig}
          />

          <Palette
            title="Backgrounds"
            type="background"
            colors={backgrounds}
            selectedId={selectedColor.type === 'background' ? selectedColor.id : -1}
            onSelect={(id) => selectColor('background', id)}
            onAdd={addBackground}
            onRemove={removeBackground}
            updateForeground={updateForeground}
            updateBackground={updateBackground}
            visualConfig={visualConfig}
          />

          <ContrastGrid foregrounds={foregrounds} backgrounds={backgrounds} visualConfig={visualConfig} />
        </div>
      </div>

      <div className="hidden md:block max-w-1/4 border-l border-gray-200 bg-white overflow-y-auto">
        <ColorEditor selectedColor={selectedColor} foregrounds={foregrounds} backgrounds={backgrounds} updateForeground={updateForeground} updateBackground={updateBackground} visualConfig={visualConfig} onVisualChange={(next) => setVisualConfig(next)} onVisualReset={resetVisualConfig} />
      </div>

      <Modal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} title="Edit color">
        <ColorEditor selectedColor={selectedColor} foregrounds={foregrounds} backgrounds={backgrounds} updateForeground={updateForeground} updateBackground={updateBackground} visualConfig={visualConfig} onVisualChange={(next) => setVisualConfig(next)} onVisualReset={resetVisualConfig} />
      </Modal>
    </main>
  );
};

export default ContrastChecker;