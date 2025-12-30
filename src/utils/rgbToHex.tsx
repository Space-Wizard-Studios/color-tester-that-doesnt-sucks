import { RGB } from '../types/RGB';

export const rgbToHex = (rgb: RGB) => {
  return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
};
