import React from 'react';
import { ContrastResult } from './ContrastResult';
import type { Color } from '../types/Color';

type ContrastGridProps = {
    foregrounds: Color[];
    backgrounds: Color[];
};

export const ContrastGrid: React.FC<ContrastGridProps> = ({ foregrounds, backgrounds }) => (
    <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contrast Results ({foregrounds.length} × {backgrounds.length} = {foregrounds.length * backgrounds.length} combinations)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foregrounds.map(fg => backgrounds.map(bg => (
                <ContrastResult key={`${fg.id}-${bg.id}`} fg={fg} bg={bg} />
            )))}
        </div>
    </div>
);

export default ContrastGrid;
