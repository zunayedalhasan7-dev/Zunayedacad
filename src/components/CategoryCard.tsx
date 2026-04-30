import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  desc?: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

export default function CategoryCard({ title, desc, icon, color, href }: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -15;
    const rotateYValue = ((x - centerX) / centerX) * 15;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <Link to={href} className="group block h-full">
      <div style={{ perspective: 1000 }} className="h-full">
        <motion.div 
          ref={cardRef}
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="h-full bg-white  rounded-2xl p-6 transition-all border border-slate-200 text-center flex flex-col items-center justify-center shadow-sm hover:shadow-sm hover:border-primary-100 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <div className="w-20 h-20 mb-5 relative group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-primary-50 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {icon}
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2 drop-shadow-sm">{title}</h3>
          {desc && <p className="text-slate-500 text-xs hidden sm:block">{desc}</p>}
        </motion.div>
      </div>
    </Link>
  );
}
