import React from 'react';
import type { Color, VisualConfig } from '../../types/Color';
import useContrastData from '../../hooks/useContrastData';
import ContrastHeader from './ContrastHeader';
import ContrastBadges from './ContrastBadges';
import ComplianceGrid from '../ComplianceGrid';
import SamplePreviews from './ContrastPreviews';

type ContrastResultProps = { fg: Color; bg: Color; visualConfig?: VisualConfig };

export const ContrastResult: React.FC<ContrastResultProps> = ({ fg, bg, visualConfig }) => {
  const data = useContrastData(fg, bg, visualConfig);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-4">
      <ContrastHeader data={data} fgName={fg.name} bgName={bg.name} />
      <SamplePreviews fgCss={data.fgCss} bgCss={data.bgCss} />
      <ComplianceGrid compliance={data.compliance} />
      <ContrastBadges data={data} />
    </div>
  );
};

export default ContrastResult;
