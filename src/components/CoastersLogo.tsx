/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { COLORS } from '../constants';

interface LogoProps {
  theme: 'tavern' | 'social_club' | 'both';
  className?: string;
  color?: string;
  accentColor?: string;
}

export const CoastersLogo: React.FC<LogoProps> = ({ theme, className = "w-24 h-24", color = "white", accentColor = COLORS.gold }) => {
  if (theme === 'social_club') {
    return (
      <img 
        src="/logo-social.png" 
        alt="Coasters Tavern Social Club Logo" 
        className={`object-contain ${className}`}
      />
    );
  } else if (theme === 'both') {
    return (
      <div className={`flex gap-4 items-center justify-center ${className}`}>
        <img 
          src="/logo-tavern.png" 
          alt="Coasters Tavern Logo" 
          className="w-full h-full object-contain"
        />
        <img 
          src="/logo-social.png" 
          alt="Coasters Tavern Social Club Logo" 
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Default to tavern
  return (
    <img 
      src="/logo-tavern.png" 
      alt="Coasters Tavern Logo" 
      className={`object-contain ${className}`}
    />
  );
};
