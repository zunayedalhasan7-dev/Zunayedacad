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
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Banner */}
      <section className="bg-primary-600 py-16 lg:py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-6"
          >
            <h1 className="text-4xl lg:text-5xl font-bold">আমাদের ফ্রি কোর্সসমূহ</h1>
            <p className="text-primary-100 text-lg max-w-2xl">
              শিখুন একদম ফ্রিতে আমাদের বিশেষজ্ঞ শিক্ষকদের সাথে। হাই-কোয়ালিটি ভিডিও টিউটোরিয়াল দিয়ে আপনার যাত্রা আজই শুরু হোক।
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0"
          >
            <img 
              src="https://img.freepik.com/free-vector/3d-cartoon-online-registration-concept_107791-16477.jpg" 
              alt="Free Course Illustration" 
              className="w-64 h-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-xl shadow-slate-200 border border-slate-100" />
            ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded shadow-lg">
                    FREE
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span className="flex items-center"><Award className="mr-1 h-4 w-4" /> সার্টিফিকেট</span>
                    <span className="flex items-center"><Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" /> ৪.৯</span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold hover:bg-primary-600 hover:text-white transition-all group"
                  >
                    শুরু করুন <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={course.thumb} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded shadow-lg">
                    FREE
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span className="flex items-center"><Award className="mr-1 h-4 w-4" /> সার্টিফিকেট</span>
                    <span className="flex items-center"><Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" /> ৪.৯</span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold hover:bg-primary-600 hover:text-white transition-all"
                  >
                    শুরু করুন <ArrowRight className="ml-2 h-4 w-4" />
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
