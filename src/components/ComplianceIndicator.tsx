import React from 'react';
import { Check, X } from 'lucide-react';

export const ComplianceIndicator: React.FC<{ passes: boolean }> = ({ passes }) => (
    passes ? (
        <Check className="w-4 h-4 text-green-600" />
    ) : (
        <X className="w-4 h-4 text-red-600" />
    )
);

export default ComplianceIndicator;
