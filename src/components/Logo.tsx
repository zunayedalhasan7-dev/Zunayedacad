import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  white?: boolean;
  iconOnly?: boolean;
}

export default function Logo({ className = "", showText = false, white = false }: LogoProps) {
  const [imgError, setImgError] = useState(false);

  const logoSrc = "https://i.postimg.cc/Bvw0k4HD/ZUNAYED-Photoroom.png";

  return (
    <div className={`flex items-center group ${className}`}>
      <div className="relative">
        <div className={`absolute inset-0 ${white ? 'bg-white/20' : 'bg-primary-50'} blur-xl opacity-30 group-hover:opacity-60 transition-opacity rounded-full shadow-2xl`}></div>
        <img 
          src={logoSrc} 
          alt="Zunayed Academy" 
          className="h-24 md:h-36 w-auto object-contain relative z-10 transition-transform group-hover:scale-105 duration-300"
          onError={() => setImgError(true)}
        />
        {imgError && (
          <div className={`${white ? 'bg-white' : 'bg-primary-600'} p-3 rounded-full relative z-10 shadow-lg`}>
            <GraduationCap className={`h-16 w-16 ${white ? 'text-primary-600' : 'text-white'}`} />
          </div>
        )}
      </div>
    </div>
  );
}
