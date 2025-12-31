import React from 'react';
import type { ContrastData } from '../../hooks/useContrastData';

type Props = { data: ContrastData };

type BadgeVariant = 'success' | 'danger' | 'warn' | 'muted';
const Badge: React.FC<{ children: React.ReactNode; variant?: BadgeVariant; title?: string }> = ({ children, variant = 'muted', title }) => {

    let cls = 'bg-gray-50 text-gray-700';
    if (variant === 'success') {
        cls = 'bg-green-50 text-green-800';
    } else if (variant === 'danger') {
        cls = 'bg-red-50 text-red-800';
    } else if (variant === 'warn') {
        cls = 'bg-yellow-50 text-yellow-800';
    }

    return <div title={title} aria-label={title} className={`text-xs px-2 py-1 rounded ${cls}`}>{children}</div>;
};

export const ContrastBadges: React.FC<Props> = ({ data }) => {
    return (
        <div className="grid grid-cols-2 gap-2">
            <div className='space-y-1'>
                <div className="text-xs font-medium text-gray-600 mb-2">Extra tests</div>
                <Badge
                    variant={data.nonTextOriginal ? 'success' : 'danger'}
                    title={`Non-text contrast (UI) — threshold 3:1. Passes when UI element contrast ≥ 3:1`}>
                    Non-text: {data.nonTextOriginal ? 'pass' : 'fail'}
                </Badge>
                <Badge
                    variant={data.iconOriginal ? 'success' : 'danger'}
                    title={`Icon contrast — threshold 3:1. Passes when icon contrast ≥ 3:1`}>
                    Icon: {data.iconOriginal ? 'pass' : 'fail'}
                </Badge>
                <Badge
                    variant={data.deltaPass ? 'success' : 'danger'}
                    title={`ΔE (OKLCH) = ${data.delta.toFixed(3)} — ${data.deltaLabel}. Larger ΔE means more perceptual difference.`}>
                    ΔE: {data.delta.toFixed(3)} ({data.deltaLabel})
                </Badge>
                <Badge
                    variant={data.chromaticVibration ? 'warn' : 'success'}
                    title={data.chromaticVibration ? 'Chromatic vibration detected — high saturation + mid-range hue difference (may cause discomfort)' : 'No chromatic vibration detected'}>
                    Vibration: {data.chromaticVibration ? 'fail' : 'pass'}
                </Badge>
            </div>

            <div className='space-y-4'>
                <div>
                    <div className="text-xs font-medium text-gray-600 mb-2">Ambient tests (gamma / contrast)</div>
                    <Badge
                        variant={data.ambientPass ? 'success' : 'danger'}
                        title={`Worst-case contrast across presets: ${data.ambient.worstContrast.toFixed(2)}. Pass threshold: 3:1`}>
                        Worst Ambient: {data.ambientPass ? 'pass' : 'fail'} ({data.ambient.worstContrast.toFixed(2)})
                    </Badge>
                </div>

                <div>
                    <div className="text-xs font-medium text-gray-600 mb-2">Visual Impairment tests</div>
                    <Badge
                        variant={data.simulatedSummary.simulatedPass ? 'success' : 'danger'}
                        title={`Simulated contrast — original ${data.simulatedSummary.originalContrast.toFixed(2)} → simulated ${data.simulatedSummary.simulatedContrast.toFixed(2)}. Passes when simulated contrast ≥ 3:1`}>
                        Visual Tests: {data.simulatedSummary.simulatedPass ? 'pass' : 'fail'}
                    </Badge>
                </div>


            </div>

        </div>
    );
};

export default ContrastBadges;
