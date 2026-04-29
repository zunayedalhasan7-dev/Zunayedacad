import React from 'react';

export default function FooterBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" id="footer-bg">
      <svg
        viewBox="0 0 1440 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full preserve-3d"
        preserveAspectRatio="none"
      >
        {/* Main Background Gradient */}
        <rect width="1440" height="400" fill="url(#footer_main_grad)" />

        {/* Layered Waves */}
        <path
          d="M0 120C120 100 240 80 480 120C720 160 960 200 1200 160C1320 140 1440 120 1440 120V400H0V120Z"
          fill="url(#wave_grad_1)"
          opacity="0.6"
        />
        <path
          d="M0 180C150 160 300 140 600 180C900 220 1200 260 1440 220V400H0V180Z"
          fill="url(#wave_grad_2)"
          opacity="0.4"
        />
        
        {/* Abstract Glowing Blobs */}
        <circle cx="200" cy="300" r="150" fill="url(#glow_purple)" opacity="0.15" />
        <circle cx="1200" cy="100" r="200" fill="url(#glow_cyan)" opacity="0.1" />

        {/* Subtle Education Hints */}
        <g opacity="0.05" stroke="white" strokeWidth="2">
          {/* Book Outline */}
          <path d="M100 80H130C135.523 80 140 84.4772 140 90V130C140 124.477 135.523 120 130 120H100V80Z" transform="rotate(-15 120 105)" />
          {/* Play Button */}
          <path d="M800 50L820 65L800 80V50Z" transform="rotate(10 810 65)" />
          {/* Circle Grid */}
          <circle cx="1300" cy="250" r="3" fill="white" />
          <circle cx="1320" cy="250" r="3" fill="white" />
          <circle cx="1340" cy="250" r="3" fill="white" />
        </g>

        {/* Gradients Definition */}
        <defs>
          <linearGradient id="footer_main_grad" x1="720" y1="0" x2="720" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E293B" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
          
          <linearGradient id="wave_grad_1" x1="720" y1="100" x2="720" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#312E81" />
            <stop offset="1" stopColor="#1E1B4B" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="wave_grad_2" x1="720" y1="150" x2="720" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1D4ED8" />
            <stop offset="1" stopColor="#1E3A8A" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="glow_purple" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 300) rotate(90) scale(150)">
            <stop stopColor="#A855F7" />
            <stop offset="1" stopColor="#A855F7" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="glow_cyan" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1200 100) rotate(90) scale(200)">
            <stop stopColor="#06B6D4" />
            <stop offset="1" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
