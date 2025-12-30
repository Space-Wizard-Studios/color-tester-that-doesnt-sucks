import { relativeLuminance } from './relativeLuminance';
import { RGB } from '../types/RGB';

export const calculateContrast = (rgb1: RGB, rgb2: RGB) => {
  const lum1 = relativeLuminance(rgb1);
  const lum2 = relativeLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};
