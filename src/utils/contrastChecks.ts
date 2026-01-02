import { calculateContrast, rgbToOklch, applyVisualConfig } from './index';
import type { VisualConfig, RGB } from '../types/Color';

export const NON_TEXT_CONTRAST_THRESHOLD = 3;
export const ICON_CONTRAST_THRESHOLD = 3;

export const checkNonTextContrast = (fg: RGB, bg: RGB, threshold = NON_TEXT_CONTRAST_THRESHOLD) => {
  return calculateContrast(fg, bg) >= threshold;
};

export const checkIconContrast = (fg: RGB, bg: RGB, threshold = ICON_CONTRAST_THRESHOLD) => {
  return calculateContrast(fg, bg) >= threshold;
};

// Perceptual Delta-E in OKLab space derived from OKLCH
export const deltaEoklch = (fg: RGB, bg: RGB) => {
  const a = rgbToOklch(fg);
  const b = rgbToOklch(bg);
  // convert polar (L, C, Hdeg) to OKLab a,b
  const toAB = (c: { l: number; c: number; h: number }) => {
    const rad = (c.h * Math.PI) / 180;
    const ax = c.c * Math.cos(rad);
    const by = c.c * Math.sin(rad);
    return { L: c.l, a: ax, b: by };
  };
  const A = toAB(a);
  const B = toAB(b);
  const dL = A.L - B.L;
  const da = A.a - B.a;
  const db = A.b - B.b;
  return Math.hypot(dL, da, db);
};

// Simulate visual config and return contrasts and pass/fail for a given threshold
export const simulateAndCheck = (fg: RGB, bg: RGB, config?: VisualConfig, threshold = NON_TEXT_CONTRAST_THRESHOLD) => {
  const original = calculateContrast(fg, bg);
  if (!config) return {
    originalContrast: original,
    simulatedContrast: original,
    simulatedPass: original >= threshold,
    simulatedPassAA: original >= 4.5,
    simulatedPassAAA: original >= 7
  };
  const fgAdj = applyVisualConfig(fg, config);
  const bgAdj = applyVisualConfig(bg, config);
  const simulated = calculateContrast(fgAdj, bgAdj);
  return {
    originalContrast: original,
    simulatedContrast: simulated,
    simulatedPass: simulated >= threshold,
    simulatedPassAA: simulated >= 4.5,
    simulatedPassAAA: simulated >= 7
  };
};

export const evaluateAmbientVariants = (fg: RGB, bg: RGB, variants: Partial<VisualConfig>[] = []) => {
  if (!variants || variants.length === 0) return { worstContrast: calculateContrast(fg, bg), worstVariant: null };
  let worstContrast = Infinity;
  let worstVariant: Partial<VisualConfig> | null = null;
  for (const v of variants) {
    const cfg: VisualConfig = {
      gamma: v.gamma ?? 1,
      contrast: v.contrast ?? 1,
      protanopia: v.protanopia ?? 0,
      deuteranopia: v.deuteranopia ?? 0,
      tritanopia: v.tritanopia ?? 0,
    };
    const fgAdj = applyVisualConfig(fg, cfg);
    const bgAdj = applyVisualConfig(bg, cfg);
    const c = calculateContrast(fgAdj, bgAdj);
    if (c < worstContrast) {
      worstContrast = c;
      worstVariant = v;
    }
  }
  return { worstContrast, worstVariant };
};

// Detect potentially irritating "vibrating" color pairs: both highly saturated
// and with a mid-range hue difference (not too close, not complementary),
// which often causes visual discomfort when used for adjacent areas or text.
export const CHROMA_VIBRATION_THRESHOLD = 0.15; // empirical
export const CHROMA_VIBRATION_MIN_HUE = 30; // degrees
// Include complementary pairs (up to 180°) as potential vibration — complementary
// high-chroma pairs can also be visually jarring, so allow up to 180° here.
export const CHROMA_VIBRATION_MAX_HUE = 180; // degrees

export const checkChromaticVibration = (fg: RGB, bg: RGB) => {
  const a = rgbToOklch(fg);
  const b = rgbToOklch(bg);
  const c1 = a.c;
  const c2 = b.c;
  // both need to be sufficiently saturated
  if (c1 <= CHROMA_VIBRATION_THRESHOLD || c2 <= CHROMA_VIBRATION_THRESHOLD) return false;
  // compute smallest hue difference
  const diff = Math.abs(a.h - b.h);
  const hueDiff = diff > 180 ? 360 - diff : diff;
  return hueDiff >= CHROMA_VIBRATION_MIN_HUE && hueDiff <= CHROMA_VIBRATION_MAX_HUE;
};

export default {
  checkNonTextContrast,
  checkIconContrast,
  deltaEoklch,
  simulateAndCheck,
  evaluateAmbientVariants,
};
