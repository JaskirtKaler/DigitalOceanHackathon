import React from 'react';
import PlaneLogo from '../assets/icons/plane-departure-solid-svgrepo-com.svg';

interface AeroGradientLogoProps {
  className?: string;
  showText?: boolean;
}

const AeroGradientLogo: React.FC<AeroGradientLogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <img src={PlaneLogo} alt="AeroGradient Logo" style={{ width: 32, height: 32 }} />
      {showText && (
        <span style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em', color: '#111827' }}>
          AeroGradient
        </span>
      )}
    </div>
  );
};

export default AeroGradientLogo;
