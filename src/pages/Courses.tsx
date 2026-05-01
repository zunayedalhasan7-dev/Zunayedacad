import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Course, CourseCategory } from '../types';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { EmptyCoursesIllustration } from '../components/Illustrations';
import CourseCard from '../components/CourseCard';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');

  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    if (search !== null) setSearchTerm(search);
    if (category !== null) setSelectedCategory(category);
  }, [searchParams]);

  useEffect(() => {
    const coursesQuery = query(collection(db, 'courses'), where('status', '==', 'published'));
    
    const unsubscribe = onSnapshot(coursesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setCourses(data);
      setLoading(false);
    }, (err: any) => {
      console.error('Courses fetch error:', err);
      handleFirestoreError(err, OperationType.LIST, 'courses');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Object.values(CourseCategory)];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-12 relative overflow-hidden">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-primary-50 opacity-[0.03] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[50%] bg-primary-50 opacity-[0.03] blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">সকল কোর্সসমূহ</h1>
            <p className="text-slate-500 text-lg">আপনার পছন্দের বিষয় বেছে নিন এবং শেখা শুরু করুন</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-primary-600 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="pl-4">
                  <Search className="h-5 w-5 text-slate-500 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="কোর্স খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchParams(prev => {
                      if (e.target.value) prev.set('search', e.target.value);
                      else prev.delete('search');
                      return prev;
                    }, { replace: true });
                  }}
                  className="w-full pl-3 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-500 focus:outline-none sm:w-64"
                />
              </div>
            </div>
            
            <div className="flex bg-white  p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto whitespace-nowrap hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSearchParams(prev => {
                      if (cat === 'All') prev.delete('category');
                      else prev.set('category', cat);
                      return prev;
                    }, { replace: true });
                  }}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat 
                      ? 'bg-primary-600 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'All' ? 'সবগুলো' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl h-[380px] animate-pulse border border-slate-200 shadow-lg" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                <CourseCard
                  id={course.id}
                  title={course.title}
                  instructor={course.instructorName || 'Unknown Instructor'}
                  price={course.discountPrice || course.price}
                  originalPrice={course.discountPrice ? course.price : undefined}
                  rating={5.0} // Fallback rating since Course type doesn't have it yet
                  thumb={course.thumbnail}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white  rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 to-transparent z-0"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 mb-6 w-48 h-48 mx-auto filter drop-shadow-sm"
            >
              <EmptyCoursesIllustration />
            </motion.div>
            <h2 className="relative z-10 text-2xl font-bold text-slate-900 mb-3">কোন কোর্স পাওয়া যায়নি</h2>
            <p className="relative z-10 text-slate-500">অন্য কোন মডুাউল বা কীওয়ার্ড দিয়ে সার্চ করুন</p>
          </div>
        )}
      </div>
    </div>
  );
}
