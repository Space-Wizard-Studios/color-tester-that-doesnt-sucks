import { RGB } from "../types/Color";

export const rgbToCss = (rgb: RGB, a = 1) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
