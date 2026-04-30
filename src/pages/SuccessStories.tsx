import React from 'react';
import { Star, PlayCircle, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function SuccessStories() {
  const stories = [
    {
      id: 1,
      name: "আরিফ হোসেন",
      institution: "ঢাকা বিশ্ববিদ্যালয়",
      quote: "এইচএসসি তে দুর্বল থাকা সত্ত্বেও অ্যাডমিশন টেস্টে ভালো করা সম্ভব হয়েছে জুনায়েদ একাডেমির গাইডলাইনের কারণে।",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=60",
      videoThumb: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      name: "সুমাইয়া জান্নাত",
      institution: "ফ্রিল্যান্সার, আপওয়ার্ক",
      quote: "গ্রিন জিরো থেকে গ্রাফিক ডিজাইনের কোর্স করে আজ আমি একজন সফল ফ্রিল্যান্সার। মেন্টরদের ডেডিকেশন সত্যিই অসাধারণ।",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=60",
      videoThumb: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      name: "রাকিবুল হাসান",
      institution: "বুয়েট (ভর্তিচ্ছু)",
      quote: "গণিতের ভয় এখন আর নেই। এত সুন্দর করে বেসিক থেকে পড়ানো হয় যে যেকোনো অধ্যায় পানির মত সহজ মনে হয়।",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=60",
      videoThumb: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-24 relative overflow-hidden">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-amber-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-primary-50 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-400/20 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="inline-flex items-center justify-center p-4 bg-white  border border-slate-200 rounded-2xl mb-8 shadow-sm relative z-10 hover:scale-110 transition-transform cursor-default">
            <Star className="w-10 h-10 text-amber-400 fill-amber-400 drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-bengali text-slate-900 mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 drop-shadow-sm">শিক্ষার্থীদের সাফল্যের গল্প</h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-sans font-medium">
            জুনায়েদ একাডেমির সাথে হাজারো শিক্ষার্থীর স্বপ্ন পূরণের গল্প। 
            <br className="hidden md:block" /> তাদের ডেডিকেশন এবং আমাদের গাইডলাইন কীভাবে পরিবর্তন এনেছে, তা শুনুন তাদের মুখ থেকেই।
          </p>
        </div>

        {/* Video Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
           {stories.map((story, i) => (
             <motion.div 
               key={story.id}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.15 }}
               className="flex flex-col group h-full"
             >
                {/* Video Thumbnail area */}
                <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-6 shadow-sm cursor-pointer border border-slate-200 group-hover:border-amber-400/30 transition-all duration-500 z-20 shrink-0">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 z-10"></div>
                   <img src={story.videoThumb} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-slate-50 group-hover:bg-amber-400/10 transition-colors flex items-center justify-center z-20">
                      <div className="w-20 h-20 bg-slate-100  border border-slate-200 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 transition-all shadow-sm group-hover:shadow-sm">
                         <PlayCircle className="w-10 h-10 text-slate-900 ml-1 drop-shadow-sm" />
                      </div>
                   </div>
                </div>

                {/* Content */}
                <div className="bg-white  p-8 rounded-[2rem] border border-slate-200 flex-1 relative -mt-16 pt-20 group-hover:border-slate-200 transition-colors shadow-sm flex flex-col z-10">
                   <div className="absolute top-24 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Quote className="w-24 h-24 text-amber-400 rotate-180" />
                   </div>
                   <p className="text-slate-600 text-lg leading-relaxed mb-8 relative z-10 font-sans italic flex-1 group-hover:text-slate-900 transition-colors">
                     "{story.quote}"
                   </p>
                   
                   <div className="flex items-center gap-5 mt-auto relative z-10 border-t border-slate-200 pt-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
                        <img src={story.image} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 relative z-10" />
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900 text-lg font-bengali">{story.name}</h4>
                         <p className="text-amber-400 font-medium text-sm font-sans tracking-wide">{story.institution}</p>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="mt-32 text-center relative">
           <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-indigo-500/20 to-amber-400/20 blur-[100px] rounded-full pointer-events-none"></div>
           <div className="bg-white  rounded-[3rem] p-10 md:p-20 relative overflow-hidden border border-slate-200 shadow-sm group">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
               <div className="absolute inset-0 bg-white"></div>
               <div className="relative z-10 max-w-3xl mx-auto text-slate-900">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 font-bengali bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">পরবর্তী সাফল্যের গল্পটি কি আপনার?</h2>
                  <p className="text-slate-500 text-lg md:text-xl mb-12 font-sans">আজই আমাদের যেকোনো কোর্সে যুক্ত হোন এবং শুরু করুন আপনার সফলতার যাত্রা।</p>
                  <Link to="/courses" className="inline-flex items-center justify-center px-10 py-5 bg-primary-600 text-white font-bold text-xl rounded-2xl hover:shadow-sm transition-all overflow-hidden group/btn relative">
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out"></div>
                    <span className="relative z-10 flex items-center">কোর্স সমূহ দেখুন <Star className="w-5 h-5 ml-2 fill-current" /></span>
                  </Link>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
}
