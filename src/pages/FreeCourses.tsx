import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Course } from '../types';
import { PlayCircle, Award, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function FreeCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreeCourses = async () => {
      try {
        const q = query(
          collection(db, 'courses'),
          where('price', '==', 0),
          where('status', '==', 'published')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(data);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'courses');
      } finally {
        setLoading(false);
      }
    };

    fetchFreeCourses();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 relative overflow-hidden">
      {/* Base Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-primary-50 blur-[150px] rounded-full"></div>
      </div>

      {/* Banner */}
      <section className="bg-primary-600  py-16 lg:py-24 text-white overflow-hidden relative border-b border-slate-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />
        <div className="absolute inset-0 bg-slate-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-6"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-bengali bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-primary-600">আমাদের ফ্রি কোর্সসমূহ</h1>
            <p className="text-slate-600 text-lg max-w-2xl font-medium leading-relaxed font-sans">
              শিখুন একদম ফ্রিতে আমাদের বিশেষজ্ঞ শিক্ষকদের সাথে। হাই-কোয়ালিটি ভিডিও টিউটোরিয়াল দিয়ে আপনার যাত্রা আজই শুরু হোক।
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0 filter drop-shadow-sm"
          >
            <img 
              src="https://img.freepik.com/free-vector/3d-cartoon-online-registration-concept_107791-16477.jpg" 
              alt="Free Course Illustration" 
              className="w-64 lg:w-80 h-auto rounded-[2rem] border border-slate-200"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[2rem] h-80 animate-pulse shadow-sm border border-slate-200" />
            ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -10 }}
                className="bg-white  rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:border-emerald-400/50 transition-all duration-300 group flex flex-col h-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80 pointer-events-none z-10"></div>
                
                <div className="relative aspect-video overflow-hidden shrink-0 z-0 border-b border-slate-200">
                  <div className="absolute inset-0 bg-slate-50 group-hover:bg-emerald-400/10 transition-colors z-10"></div>
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-5 left-5 z-20 bg-emerald-500/20  text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg shadow-sm border border-emerald-400/30">
                    FREE
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="bg-slate-100 p-4 rounded-full border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                      <PlayCircle className="h-10 w-10 text-emerald-400 fill-emerald-400/20 drop-shadow-sm" />
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1 relative z-20">
                  <h3 className="font-bold text-xl text-slate-900 leading-tight mb-4 group-hover:text-emerald-400 transition-colors font-bengali line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-slate-500 mt-auto mb-6 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200">
                    <span className="flex items-center text-emerald-400/80 font-medium"><Award className="mr-2 h-4 w-4" /> সার্টিফিকেট</span>
                    <span className="flex items-center text-amber-400/90 font-medium font-sans"><Star className="mr-1 h-3.5 w-3.5 fill-amber-400" /> 4.9</span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="w-full inline-flex items-center justify-center px-6 py-4 bg-emerald-400/10 text-emerald-400 rounded-2xl font-bold hover:bg-emerald-400 hover:text-slate-900 transition-colors group/btn border border-emerald-400/20 shadow-sm text-lg overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out pointer-events-none"></div>
                    <span className="relative z-10 flex items-center">শুরু করুন <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" /></span>
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            // Demo data if no results from DB yet
             [
              { id: 'free1', title: 'SSC গণিত: জ্যামিতি পার্ট-১', thumb: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&fit=crop' },
              { id: 'free2', title: 'HSC ইংরেজি গ্রামার: ন্যারেশন', thumb: 'https://images.unsplash.com/photo-1546410531-bb4caa1b424d?w=500&fit=crop' },
              { id: 'free3', title: 'ফ্রিল্যান্সিং গাইডলাইনস ২০২৩', thumb: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&fit=crop' },
            ].map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -10 }}
                className="bg-white  rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:border-emerald-400/50 transition-all duration-300 group flex flex-col h-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80 pointer-events-none z-10"></div>
                
                <div className="relative aspect-video overflow-hidden shrink-0 z-0 border-b border-slate-200">
                  <div className="absolute inset-0 bg-slate-50 group-hover:bg-emerald-400/10 transition-colors z-10"></div>
                  <img src={course.thumb} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-5 left-5 z-20 bg-emerald-500/20  text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg shadow-sm border border-emerald-400/30">
                    FREE
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="bg-slate-100 p-4 rounded-full border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                      <PlayCircle className="h-10 w-10 text-emerald-400 fill-emerald-400/20 drop-shadow-sm" />
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1 relative z-20">
                  <h3 className="font-bold text-xl text-slate-900 leading-tight mb-4 group-hover:text-emerald-400 transition-colors font-bengali line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-slate-500 mt-auto mb-6 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200">
                    <span className="flex items-center text-emerald-400/80 font-medium"><Award className="mr-2 h-4 w-4" /> সার্টিফিকেট</span>
                    <span className="flex items-center text-amber-400/90 font-medium font-sans"><Star className="mr-1 h-3.5 w-3.5 fill-amber-400" /> 4.9</span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="w-full inline-flex items-center justify-center px-6 py-4 bg-emerald-400/10 text-emerald-400 rounded-2xl font-bold hover:bg-emerald-400 hover:text-slate-900 transition-colors group/btn border border-emerald-400/20 shadow-sm text-lg overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out pointer-events-none"></div>
                    <span className="relative z-10 flex items-center">শুরু করুন <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" /></span>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
