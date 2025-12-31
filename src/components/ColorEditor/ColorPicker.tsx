import React from 'react';
import { SketchPicker } from 'react-color';

type RGB = { r: number; g: number; b: number; a?: number };

type Props = {
  color: RGB;
  onChange: (c: RGB) => void;
};

export const ColorPicker: React.FC<Props> = ({ color, onChange }) => {
  const handleChange = (c: any) => {
    const next: RGB = { r: c.rgb.r, g: c.rgb.g, b: c.rgb.b, a: c.rgb.a };
    onChange(next);
  };

  return (
    <div className="mb-6 w-full">
      <SketchPicker
        color={{ r: color.r, g: color.g, b: color.b, a: color.a ?? 1 }}
        onChange={handleChange}
        disableAlpha={true}
        styles={{ default: { picker: { width: '100%', boxShadow: 'none', padding: 0 } } }}
      />
    </div>
  );
};

export default ColorPicker;
