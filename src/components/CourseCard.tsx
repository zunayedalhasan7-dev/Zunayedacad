import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  rating: number;
  thumb: string;
  badge?: 'LIVE' | 'NEW' | 'POPULAR';
}

export default function CourseCard({ id, title, instructor, price, originalPrice, rating, thumb, badge }: CourseCardProps) {
  return (
    <div className="snap-center h-full">
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-100 transition-all flex flex-col min-w-[280px] sm:min-w-0 group h-full relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="aspect-[16/10] relative overflow-hidden">
          <img src={thumb} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent opacity-60"></div>
          
          {/* Badges system */}
          <div className="absolute top-4 left-4 z-10 w-full pr-8">
              {badge === 'LIVE' && <span className="bg-red-500/90  text-slate-900 text-[10px] font-bold px-2 py-1 rounded tracking-wider shadow-sm border border-red-400/50 flex items-center gap-1 w-max"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> LIVE</span>}
              {badge === 'NEW' && <span className="bg-emerald-500/90  text-slate-900 text-[10px] font-bold px-2 py-1 rounded tracking-wider mx-shadow-sm border border-emerald-400/50 w-max block">NEW</span>}
              {badge === 'POPULAR' && <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded tracking-wider shadow-sm border border-amber-400/50 w-max block">POPULAR</span>}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow relative z-10">
          <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-600/20 to-indigo-600/20 border border-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-600 shadow-sm">
                      {instructor.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{instructor}</span>
              </div>
              <div className="flex items-center text-amber-400 text-xs font-bold drop-shadow-sm">
                  <Star className="mr-1 h-3.5 w-3.5 fill-amber-400 text-transparent" /> {rating}
              </div>
          </div>

          <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors leading-snug mb-4 flex-grow line-clamp-2 drop-shadow-sm">
            {title}
          </h3>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-auto">
            <div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-200">
                {price === 0 ? 'Free' : `৳${price}`}
              </span>
              {originalPrice && originalPrice > 0 && price !== originalPrice && (
                <span className="ml-2 text-sm text-slate-500 line-through">৳{originalPrice}</span>
              )}
            </div>
            <Link 
              to={`/courses/${id}`} 
              className="relative px-5 py-2 overflow-hidden rounded-xl bg-slate-50 border border-slate-200 group/btn hover:border-primary-100 hover:shadow-sm transition-all"
            >
              <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-primary-600 group-hover/btn:text-white font-semibold text-sm transition-colors">
                Enroll
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
