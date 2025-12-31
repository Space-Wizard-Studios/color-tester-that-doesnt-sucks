import React from 'react';
import { ComplianceIndicator } from './ComplianceIndicator';

type Compliance = {
    aa: { normal: boolean; large: boolean };
    aaa: { normal: boolean; large: boolean };
};

type Props = { compliance: Compliance };

export const ComplianceGrid: React.FC<Props> = ({ compliance }) => {
    return (
        <div className="grid grid-cols-2 gap-4 text-xs mb-4">
            <div>
                <div className="font-medium text-gray-700 mb-1">AA (Minimum)</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <ComplianceIndicator passes={compliance.aa.normal} />
                        <span className={compliance.aa.normal ? 'text-green-700' : 'text-red-700'}>Normal (4.5:1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ComplianceIndicator passes={compliance.aa.large} />
                        <span className={compliance.aa.large ? 'text-green-700' : 'text-red-700'}>Large (3:1)</span>
                    </div>
                </div>
            </div>

            <div>
                <div className="font-medium text-gray-700 mb-1">AAA (Enhanced)</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <ComplianceIndicator passes={compliance.aaa.normal} />
                        <span className={compliance.aaa.normal ? 'text-green-700' : 'text-red-700'}>Normal (7:1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ComplianceIndicator passes={compliance.aaa.large} />
                        <span className={compliance.aaa.large ? 'text-green-700' : 'text-red-700'}>Large (4.5:1)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplianceGrid;
