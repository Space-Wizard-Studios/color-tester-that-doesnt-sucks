/// <reference types="vitest" />

import { describe, test, expect } from 'vitest';
import { checkNonTextContrast, checkIconContrast, deltaEoklch, simulateAndCheck, evaluateAmbientVariants } from '../contrastChecks';

const black = { r: 0, g: 0, b: 0 };
const white = { r: 255, g: 255, b: 255 };
const gray = { r: 128, g: 128, b: 128 };

// Basic smoke tests
describe('contrastChecks', () => {
    test('black/white non-text and icon pass', () => {
        expect(checkNonTextContrast(black, white)).toBe(true);
        expect(checkIconContrast(black, white)).toBe(true);
    });

    test('deltaE identical is zero', () => {
        expect(deltaEoklch(black, black)).toBeCloseTo(0, 6);
    });

    test('simulateAndCheck returns values', () => {
        const res = simulateAndCheck(black, white, { gamma: 1, contrast: 1, protanopia: 0, deuteranopia: 0, tritanopia: 0 });
        expect(res.originalContrast).toBeGreaterThan(20);
        expect(res.simulatedContrast).toBeGreaterThan(20);
        expect(res.simulatedPass).toBe(true);
    });

    test('evaluateAmbientVariants finds worst-case', () => {
        const variants = [{ gamma: 0.8, contrast: 0.8 }, { gamma: 1.2, contrast: 1.2 }];
        const out = evaluateAmbientVariants(black, white, variants);
        expect(out.worstVariant).not.toBeNull();
        expect(out.worstContrast).toBeGreaterThan(0);
    });
});
