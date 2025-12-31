import React from 'react';
import type { Color } from '../types/Color';

type Props = {
  color: Color;
  onChange: (updates: Partial<Color>) => void;
};

export const OklchSliders: React.FC<Props> = ({ color, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <fieldset className="p-0 m-0 border-0">
          <legend className="text-sm font-medium text-gray-700 block mb-2">OKLCH</legend>
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">L</div>
              <input type="range" min="0" max="1" step="0.01" value={color.l} onChange={(e) => onChange({ l: Number(e.target.value) })} className="w-full" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">C</div>
              <input type="range" min="0" max="0.6" step="0.01" value={color.c} onChange={(e) => onChange({ c: Number(e.target.value) })} className="w-full" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">H</div>
              <input type="range" min="0" max="360" step="1" value={color.h} onChange={(e) => onChange({ h: Number(e.target.value) })} className="w-full" />
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default OklchSliders;
