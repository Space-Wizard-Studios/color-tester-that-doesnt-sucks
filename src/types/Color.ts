export interface Color {
    id: number;
    name: string;
    l: number;
    c: number;
    h: number;
    a?: number;
}

export interface RGB { r: number; g: number; b: number; }

export type SelectedColor = { type: 'foreground' | 'background'; id: number };

export interface VisualConfig {
    gamma: number; // gamma correction multiplier (>0)
    contrast: number; // contrast correction multiplier (>=0)
    protanopia: number; // 0..1 strength
    deuteranopia: number; // 0..1 strength
    tritanopia: number; // 0..1 strength
}


