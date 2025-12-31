import React from 'react';
import type { ContrastData } from '../../hooks/useContrastData';

type Props = { data: ContrastData; fgName?: string; bgName?: string };

export const ContrastHeader: React.FC<Props> = ({ data, fgName, bgName }) => {
  return (
    <div className="w-full flex-1">

      <header className="flex items-center justify-center gap-2">
        <div className="flex flex-row items-center gap-2">
          <span className="text-2xl font-bold">{fgName ?? 'Foreground'}</span>
          <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: data.fgHex }} aria-hidden />
        </div>
        <span className="text-sm text-gray-600">on</span>
        <div className="flex flex-row items-center gap-2">
          <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: data.bgHex }} aria-hidden />
          <div className="text-2xl font-bold">{bgName ?? 'Background'}</div>
        </div>
      </header>

      <div className="w-full text-xl font-medium text-gray-900 py-2">
        <div className="flex flex-row items-center justify-center gap-3">
          <span>{data.contrastOriginal.toFixed(2)}:1</span>
          <span className="text-xs text-gray-500">(WCAG)</span>
          <span>/</span>
          <span>{data.contrastSimulated.toFixed(2)}:1</span>
          <span className="text-xs text-gray-500" title="Simulated contrast">(Visual)</span>
        </div>
      </div>
    </div>
  );
};

export default ContrastHeader;
