import React from 'react';

type Props = { fgCss: string; bgCss: string };

export const SamplePreviews: React.FC<Props> = ({ fgCss, bgCss }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="p-3 rounded text-sm" style={{ backgroundColor: bgCss, color: fgCss }}>Sample text</div>
      <div className="p-3 rounded text-lg font-bold" style={{ backgroundColor: bgCss, color: fgCss }}>Large</div>
    </div>
  );
};

export default SamplePreviews;
