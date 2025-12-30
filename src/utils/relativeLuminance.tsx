import { RGB } from "../types/Color";

export const relativeLuminance = (rgb: RGB) => {
  const { r, g, b: bVal } = rgb;
  const rs = (() => { const s = r / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); })();
  const gs = (() => { const s = g / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); })();
  const bs = (() => { const s = bVal / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); })();
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};
