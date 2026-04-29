import React from 'react';

/**
 * Purposeful illustrations for Zunayed Academy EdTech LMS
 */

export const HeroIllustration = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Background Circle */}
    <circle cx="250" cy="250" r="200" fill="#F0F9FF" />
    
    {/* Large Screen/Tablet Background */}
    <rect x="80" y="100" width="340" height="240" rx="20" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="4" />
    <rect x="80" y="100" width="340" height="40" rx="20" fill="#F8FAFC" />
    <circle cx="110" cy="120" r="6" fill="#CBD5E1" />
    <circle cx="130" cy="120" r="6" fill="#CBD5E1" />
    
    {/* Teacher on Screen */}
    <rect x="240" y="150" width="160" height="170" rx="12" fill="#E0F2FE" />
    <circle cx="320" cy="220" r="30" fill="#3B82F6" />
    <path d="M320 260C280 260 270 290 270 310H370C370 290 360 260 320 260Z" fill="#1D4ED8" />
    
    {/* Lesson Content on Screen */}
    <rect x="100" y="160" width="120" height="12" rx="6" fill="#94A3B8" />
    <rect x="100" y="185" width="80" height="12" rx="6" fill="#CBD5E1" />
    <rect x="100" y="210" width="100" height="12" rx="6" fill="#CBD5E1" />
    
    {/* Student in Foreground */}
    <rect x="150" y="300" width="200" height="140" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="4" />
    <rect x="150" y="300" width="200" height="30" rx="12" fill="#F1F5F9" />
    
    {/* Student Avatar */}
    <circle cx="250" cy="370" r="20" fill="#2563EB" />
    <path d="M250 400L220 440H280L250 400Z" fill="#1E40AF" />
    
    {/* Floating Icons */}
    <circle cx="420" cy="280" r="25" fill="#A855F7" fillOpacity="0.2" />
    <path d="M415 275L430 280L415 285V275Z" fill="#A855F7" />
    
    <rect x="50" y="250" width="40" height="40" rx="8" fill="#22C55E" fillOpacity="0.1" />
    <path d="M60 270L65 275L75 265" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AcademicIllustration = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Books */}
    <rect x="100" y="150" width="140" height="180" rx="8" fill="#2563EB" />
    <rect x="100" y="150" width="20" height="180" fill="#1D4ED8" />
    <rect x="130" y="170" width="80" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.4" />
    
    <rect x="120" y="120" width="140" height="180" rx="8" fill="#4F46E5" />
    <rect x="120" y="120" width="20" height="180" fill="#4338CA" />
    <rect x="150" y="140" width="80" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.4" />

    {/* Science/Math Tools */}
    <circle cx="280" cy="180" r="40" stroke="#06B6D4" strokeWidth="6" strokeDasharray="10 5" />
    <path d="M260 180L300 180M280 160L280 200" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
    
    <path d="M150 80L180 50L210 80" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M180 50V100" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
    
    {/* Symbols */}
    <text x="320" y="280" fill="#CBD5E1" fontSize="48" fontWeight="bold">∑</text>
    <text x="50" y="100" fill="#CBD5E1" fontSize="48" fontWeight="bold">π</text>
  </svg>
);

export const SkillsIllustration = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <rect width="400" height="400" rx="40" fill="#F8FAFC" />
    
    {/* Laptop */}
    <rect x="80" y="140" width="240" height="160" rx="12" fill="#334155" />
    <rect x="95" y="155" width="210" height="130" rx="4" fill="#1E293B" />
    
    {/* Chart on Screen */}
    <rect x="110" y="240" width="20" height="30" fill="#22C55E" />
    <rect x="140" y="220" width="20" height="50" fill="#22C55E" />
    <rect x="170" y="190" width="20" height="80" fill="#22C55E" />
    <rect x="200" y="170" width="20" height="100" fill="#22C55E" />
    
    {/* Rocket */}
    <path d="M280 100L300 60L320 100L300 120L280 100Z" fill="#EF4444" />
    <path d="M300 120V140" stroke="#F59E0B" strokeWidth="4" />
    
    {/* Coins/Growth */}
    <circle cx="340" cy="300" r="20" fill="#F59E0B" />
    <text x="333" y="308" fill="white" fontSize="20" fontWeight="bold">৳</text>
    
    <circle cx="320" cy="330" r="20" fill="#F59E0B" opacity="0.6" />
    <text x="313" y="338" fill="white" fontSize="20" fontWeight="bold">৳</text>
  </svg>
);

export const DashboardIllustration = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <rect x="40" y="60" width="320" height="280" rx="20" fill="white" stroke="#E2E8F0" strokeWidth="2" />
    
    {/* Sidebar mockup */}
    <rect x="40" y="60" width="80" height="280" rx="20" fill="#F1F5F9" />
    <rect x="55" y="100" width="50" height="10" rx="5" fill="#CBD5E1" />
    <rect x="55" y="130" width="50" height="10" rx="5" fill="#CBD5E1" />
    <rect x="55" y="160" width="50" height="10" rx="5" fill="#CBD5E1" />
    
    {/* Profile */}
    <circle cx="80" cy="280" r="20" fill="#2563EB" />
    
    {/* Main area mockup */}
    <rect x="140" y="100" width="180" height="100" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
    <rect x="210" y="130" width="40" height="40" rx="20" fill="#3B82F6" />
    <path d="M225 140L240 150L225 160V140Z" fill="white" />
    
    {/* Progress bars */}
    <rect x="140" y="230" width="180" height="12" rx="6" fill="#F1F5F9" />
    <rect x="140" y="230" width="120" height="12" rx="6" fill="#22C55E" />
    
    <rect x="140" y="260" width="180" height="12" rx="6" fill="#F1F5F9" />
    <rect x="140" y="260" width="80" height="12" rx="6" fill="#22C55E" />
  </svg>
);

export const PaymentIllustration = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Background Shape */}
    <path d="M50 100C50 72.3858 72.3858 50 100 50H300C327.614 50 350 72.3858 350 100V300C350 327.614 327.614 350 300 350H100C72.3858 350 50 327.614 50 300V100Z" fill="#F8FAFC" />
    
    {/* Phone Mockup */}
    <rect x="120" y="80" width="160" height="240" rx="24" fill="#1E293B" />
    <rect x="135" y="100" width="130" height="200" rx="12" fill="#FFFFFF" />
    
    {/* Success Checkmark */}
    <circle cx="200" cy="180" r="40" fill="#22C55E" />
    <path d="M180 180L195 195L225 165" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Cards behind phone */}
    <rect x="250" y="120" width="100" height="60" rx="8" fill="#2563EB" transform="rotate(10 250 120)" />
    <rect x="50" y="200" width="100" height="60" rx="8" fill="#4F46E5" transform="rotate(-15 50 200)" />
    
    {/* Shield */}
    <path d="M300 280C300 300 280 320 260 320H240C220 320 200 300 200 280V250H300V280Z" fill="#10B981" />
    <path d="M250 240L210 260V290C210 310 250 330 250 330C250 330 290 310 290 290V260L250 240Z" fill="#059669" />
  </svg>
);

export const LanguageIllustration = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <circle cx="200" cy="200" r="150" fill="#F0FDF4" />
    {/* Speech Bubbles */}
    <path d="M120 180C120 157.909 137.909 140 160 140H240C262.091 140 280 157.909 280 180V220C280 242.091 262.091 260 240 260H220L180 290V260H160C137.909 260 120 242.091 120 220V180Z" fill="#22C55E" />
    <path d="M100 100C100 88.9543 108.954 80 120 80H160C171.046 80 180 88.9543 180 100V120C180 131.046 171.046 140 160 140H140L120 160V140H120C108.954 140 100 131.046 100 120V100Z" fill="#16A34A" />
    
    <text x="175" y="215" fill="white" fontSize="40" fontWeight="bold">A</text>
    <text x="220" y="215" fill="white" fontSize="40" fontWeight="bold">অ</text>
  </svg>
);

export const LabIllustration = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <rect width="400" height="400" rx="40" fill="#FFFBEB" />
    {/* Erlenmeyer Flask */}
    <path d="M180 120H220V160L280 280H120L180 160V120Z" fill="#F59E0B" />
    <path d="M180 120H220V130H180V120Z" fill="#D97706" />
    {/* Liquid */}
    <path d="M140 240L260 240L280 280H120L140 240Z" fill="#FBBF24" />
    {/* Bubbles */}
    <circle cx="200" cy="200" r="10" fill="white" fillOpacity="0.4" />
    <circle cx="220" cy="180" r="6" fill="white" fillOpacity="0.4" />
    
    {/* Gear */}
    <circle cx="300" cy="120" r="30" stroke="#94A3B8" strokeWidth="6" strokeDasharray="10 5" />
    <circle cx="300" cy="120" r="10" fill="#94A3B8" />
  </svg>
);

export const EmptyCoursesIllustration = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <circle cx="200" cy="200" r="150" fill="#F1F5F9" />
    <path d="M150 250L250 250L200 150L150 250Z" stroke="#94A3B8" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="200" cy="210" r="10" fill="#CBD5E1" />
    <rect x="160" y="280" width="80" height="8" rx="4" fill="#CBD5E1" />
    <text x="180" y="180" fill="#94A3B8" fontSize="64" fontWeight="bold">?</text>
  </svg>
);
