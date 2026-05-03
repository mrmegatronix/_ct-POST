/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { COLORS } from '../constants';

interface LogoProps {
  theme: 'tavern' | 'social_club';
  className?: string;
  color?: string;
  accentColor?: string;
}

export const CoastersLogo: React.FC<LogoProps> = ({ theme, className = "w-24 h-24", color = "white", accentColor = COLORS.gold }) => {
  const isSocial = theme === 'social_club';
  
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        {/* Outer Ring */}
        <circle cx="100" cy="100" r="95" fill={color === 'white' ? 'black' : color} />
        
        {/* Golden Border */}
        <circle cx="100" cy="100" r="92" fill="none" stroke={accentColor} strokeWidth="6" />
        <circle cx="100" cy="100" r="72" fill="none" stroke={accentColor} strokeWidth="1" />
        
        {/* Central Emblems - Pickaxe, Shovel, Lantern */}
        <g stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Pickaxe (Diagonal) */}
          <path d="M65 135 L135 65" strokeWidth="5" />
          <path d="M120 50 Q135 65 150 80" strokeWidth="8" />
          
          {/* Shovel (Opposite Diagonal) */}
          <path d="M65 65 L135 135" strokeWidth="5" />
          <path d="M50 50 L70 70 M50 50 L40 60 M40 60 L60 80 L70 70" fill={accentColor} />
          
          {/* Mining Lantern (Center) */}
          <g transform="translate(85, 75) scale(0.6)">
             <path d="M10 40 L40 40 L40 20 L10 20 Z" fill={accentColor} />
             <path d="M25 40 L25 50" strokeWidth="6" />
             <path d="M15 20 Q25 0 35 20" strokeWidth="4" />
             <rect x="15" y="20" width="20" height="20" fill="white" fillOpacity="0.9" />
          </g>
        </g>
        
        {/* Typography Arc */}
        <defs>
          <path id="topTextPath" d="M 30,100 A 70,70 0 1,1 170,100" />
          <path id="bottomTextPath" d="M 30,100 A 70,70 0 0,0 170,100" />
        </defs>
        
        <text fill={accentColor} className="font-serif font-black text-[22px] uppercase tracking-[0.1em]">
          <textPath xlinkHref="#topTextPath" startOffset="50%" textAnchor="middle">
            COASTERS
          </textPath>
        </text>

        <text fill={accentColor} className="font-serif font-black text-[20px] uppercase tracking-[0.05em]">
          <textPath xlinkHref="#bottomTextPath" startOffset="50%" textAnchor="middle">
            {isSocial ? 'SOCIAL CLUB' : 'TAVERN'}
          </textPath>
        </text>
      </svg>
    </div>
  );
};
