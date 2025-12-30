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


