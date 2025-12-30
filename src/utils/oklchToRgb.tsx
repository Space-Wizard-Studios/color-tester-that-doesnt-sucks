import { RGB } from "../types/Color";

export const oklchToRgb = (l: number, c: number, h: number): RGB => {
  const a = c * Math.cos((h * Math.PI) / 180);
  const bVal = c * Math.sin((h * Math.PI) / 180);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * bVal;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * bVal;
  const s_ = l - 0.0894841775 * a - 1.291485548 * bVal;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r_lin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g_lin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const b_lin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  const toSrgb = (val: number) => {
    if (val <= 0.0031308) return 12.92 * val;
    return 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };

  const r = Math.max(0, Math.min(1, toSrgb(r_lin)));
  const g = Math.max(0, Math.min(1, toSrgb(g_lin)));
  const bVal2 = Math.max(0, Math.min(1, toSrgb(b_lin)));

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(bVal2 * 255)
  };
};
