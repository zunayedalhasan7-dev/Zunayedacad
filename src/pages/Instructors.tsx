import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Users, BookOpen, Award, CheckCircle2, ArrowRight, Quote } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Instructors() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'instructors'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInstructors(docs);
      } catch (error) {
        console.error("Error fetching instructors: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const allExpertise = useMemo(() => {
    const expertiseSet = new Set<string>();
    instructors.forEach(inst => {
      if(inst.expertise && Array.isArray(inst.expertise)) {
        inst.expertise.forEach((e: string) => expertiseSet.add(e));
      }
    });
    return ['সবই', ...Array.from(expertiseSet)];
  }, [instructors]);

  const [activeFilter, setActiveFilter] = useState('সবই');

  const filteredInstructors = useMemo(() => {
    if (activeFilter === 'সবই') return instructors;
    return instructors.filter(inst => inst.expertise && inst.expertise.includes(activeFilter));
  }, [activeFilter, instructors]);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary-200 selection:text-primary-900">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-sm font-bold mb-6"
          >
            <Award className="w-4 h-4" />
            দেশের সেরা মেন্টর প্যানেল
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight"
          >
            আপনার স্বপ্ন পূরণে<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">আমাদের দক্ষ কারিগর</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium"
          >
            দেশের সেরা বিশ্ববিদ্যালয়গুলোর মেধাবী শিক্ষার্থী এবং অভিজ্ঞ শিক্ষকদের নিয়ে তৈরি আমাদের প্যানেল।
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
        
        {/* Modern Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-16">
            {allExpertise.map(expertise => (
                <button
                    key={expertise}
                    onClick={() => setActiveFilter(expertise)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                        activeFilter === expertise 
                            ? 'bg-primary-900 text-white shadow-md shadow-primary-900/20 scale-105' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                    {expertise}
                </button>
            ))}
        </div>

        {/* Editorial Grids */}
        {loading ? (
            <div className="flex justify-center items-center py-20">লোডিং...</div>
        ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          <AnimatePresence mode='popLayout'>
            {filteredInstructors.map((instructor) => (
              <motion.div
                layout
                key={instructor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-500 flex flex-col sm:flex-row relative"
              >
                {/* Image Side */}
                <div className="relative w-full sm:w-[40%] aspect-square sm:aspect-auto overflow-hidden bg-slate-100 shrink-0">
                  <div className="absolute inset-0 bg-primary-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-multiply"></div>
                  <img 
                    src={instructor.image} 
                    alt={instructor.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-900">{instructor.rating}</span>
                  </div>
                </div>
                
                {/* Content Side */}
                <div className="p-8 sm:p-10 flex flex-col flex-1 relative bg-white">
                  {/* Watermark Quote */}
                  <Quote className="absolute top-6 right-6 w-16 h-16 text-slate-50 rotate-180 z-0" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6">
                      <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {instructor.name}
                      </h3>
                      <p className="text-primary-600 text-sm font-bold tracking-wide uppercase">
                        {instructor.role}
                      </p>
                    </div>

                    <p className="text-slate-600 text-[15px] leading-relaxed mb-8 line-clamp-4 flex-grow">
                      "{instructor.bio}"
                    </p>

                    <div className="mt-auto space-y-6">
                      {/* Stats */}
                      <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                        <div>
                          <p className="text-2xl font-black text-slate-900">{instructor.students}</p>
                          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">শিক্ষার্থী</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div>
                          <p className="text-2xl font-black text-slate-900">{instructor.courses}</p>
                          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">কোর্স</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {instructor.expertise.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}
      </div>

      {/* Bento Grid - Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mb-12 md:text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">কেন আমাদের মেন্টররাই সেরা?</h2>
          <p className="text-slate-600 text-lg">গতানুগতিক শিক্ষার বাইরে গিয়ে আমরা গড়ে তুলি ভবিষ্যতের নেতৃত্ব।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 lg:col-span-2 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl group-hover:bg-primary-500/30 transition-colors"></div>
            <Award className="w-12 h-12 text-primary-400 mb-6" />
            <h3 className="text-2xl font-bold mb-3">শীর্ষস্থান অধিকারী মেন্টর</h3>
            <p className="text-slate-400 max-w-md text-lg leading-relaxed mb-8">
              বাংলাদেশের শীর্ষস্থানীয় বিশ্ববিদ্যালয় এবং মেডিকেল কলেজ থেকে আগত মেধাবী মুখ। তারা জানে কীভাবে সাফল্যের চূড়ায় পৌঁছাতে হয়।
            </p>
            <ul className="space-y-3">
              {['বাস্তবধর্মী পাঠদান', 'নিজস্ব তৈরি নোটস', 'পরীক্ষায় ভালো করার ট্রিকস'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-primary-200 transition-colors shadow-sm">
            <Star className="w-12 h-12 text-amber-500 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">৫+ বছরের অভিজ্ঞতা</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              শিক্ষা প্রদানে দীর্ঘ অভিজ্ঞতা যা শিক্ষার্থীদের আস্থা এনে দেয়। প্রতিটি শিক্ষার্থীর দুর্বল পয়েন্ট তারা দ্রুত ধরতে পারেন।
            </p>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <ArrowRight className="w-4 h-4" /> বিস্তারিত জানুন
            </div>
          </div>

          <div className="bg-primary-50 border border-primary-100 rounded-3xl p-8 hover:bg-primary-100/50 transition-colors">
            <Users className="w-12 h-12 text-primary-600 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">ওয়ান-টু-ওয়ান গাইডেন্স</h3>
            <p className="text-slate-600 leading-relaxed">
              সবার শেখার ধরণ এক নয়। তাই আমাদের মেন্টররা প্রতিটি শিক্ষার্থীকে আলাদাভাবে গাইড করার চেষ্টা করেন।
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 lg:col-span-2 flex flex-col justify-center">
            <div className="flex items-start gap-6">
              <div className="bg-emerald-100 p-4 rounded-2xl">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">লাইভ ডাউট সলভিং</h3>
                <p className="text-slate-600 leading-relaxed max-w-lg">
                  যেকোন কোর্সে শিক্ষার্থীদের ડাউট সলভ করার জন্য ২৪/৭ সাপোর্ট ব্যবস্থা এবং স্পেশাল লাইভ সেশন। আটকে গেলেই সরাসরি মেন্টরের সাহায্য!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

