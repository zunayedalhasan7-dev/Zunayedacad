import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Course, CourseCategory } from '../types';
import { Search, Filter, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { EmptyCoursesIllustration } from '../components/Illustrations';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(
          collection(db, 'courses'),
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

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Object.values(CourseCategory)];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">সকল কোর্সসমূহ</h1>
          <p className="text-slate-500">আপনার পছন্দের বিষয় বেছে নিন এবং শেখা শুরু করুন</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="কোর্স খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64 shadow-sm"
            />
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'সবগুলো' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md shadow-lg">
                    {course.category}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-lg text-slate-900 line-clamp-2 h-14">
                  {course.title}
                </h3>
                <div className="flex items-center text-sm text-slate-500 space-x-4">
                  <span className="flex items-center"><Users className="mr-1 h-4 w-4" /> ১২৫০ জন</span>
                  <span className="flex items-center"><Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" /> ৪.৯</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-primary-600">৳{course.discountPrice || course.price}</span>
                    {course.discountPrice && (
                      <span className="text-xs text-slate-400 line-through">৳{course.price}</span>
                    )}
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-lg font-bold hover:bg-primary-600 hover:text-white transition-all text-sm"
                  >
                    শুরু করি <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 w-48 h-48 mx-auto"
          >
            <EmptyCoursesIllustration />
          </motion.div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">কোন কোর্স পাওয়া যায়নি</h2>
          <p className="text-slate-500">অন্য কোন মডুাউল বা কীওয়ার্ড দিয়ে সার্চ করুন</p>
        </div>
      )}
    </div>
  );
}
