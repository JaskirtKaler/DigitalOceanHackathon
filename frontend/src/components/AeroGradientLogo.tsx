import React from 'react';

interface AeroGradientLogoProps {
  className?: string;
  showText?: boolean;
}

const AeroGradientLogo: React.FC<AeroGradientLogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="black" />
        <path d="M16 8L24 24H8L16 8Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <path d="M16 14L20 22H12L16 14Z" fill="white" />
      </svg>
      {showText && (
        <span style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em', color: '#111827' }}>
          AeroGradient
        </span>
      )}
    </div>
  );
};

export default AeroGradientLogo;
