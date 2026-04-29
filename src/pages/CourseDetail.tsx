import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Course, Lesson, Enrollment } from '../types';
import { PlayCircle, Clock, BookOpen, User, CheckCircle, ChevronRight, Lock, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // Fetch Course
        const courseDoc = await getDoc(doc(db, 'courses', id));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() } as Course);
        }

        // Fetch Lessons
        const lessonsQuery = query(collection(db, 'courses', id, 'lessons'), where('courseId', '==', id));
        const lessonsSnapshot = await getDocs(lessonsQuery);
        const lessonsData = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson)).sort((a, b) => a.order - b.order);
        setLessons(lessonsData);

        // Check Enrollment
        if (user) {
          const enrollQuery = query(collection(db, 'enrollments'), 
            where('userId', '==', user.uid), 
            where('courseId', '==', id)
          );
          const enrollSnapshot = await getDocs(enrollQuery);
          setIsEnrolled(!enrollSnapshot.empty);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `courses/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      // Mock payment success and enrollment
      await addDoc(collection(db, 'enrollments'), {
        userId: user.uid,
        courseId: id,
        enrolledAt: serverTimestamp(),
        progress: 0,
        completedLessons: []
      });
      setIsEnrolled(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'enrollments');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
      <div className="h-96 bg-slate-100 rounded-3xl mb-12"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-slate-100 rounded w-1/2"></div>
          <div className="h-32 bg-slate-100 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (!course) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <img 
          src="https://img.freepik.com/free-vector/3d-cartoon-student-character-carrying-books_107791-16480.jpg" 
          alt="Not Found"
          className="w-64 h-64 object-contain mx-auto"
        />
      </motion.div>
      <h1 className="text-2xl font-bold text-slate-900">কোর্সটি পাওয়া যায়নি</h1>
      <Link to="/courses" className="text-primary-600 mt-4 inline-block font-bold bg-primary-50 px-6 py-2 rounded-xl">সকল কোর্স দেখুন</Link>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header / Hero */}
      <div className="bg-slate-900 py-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/10 blur-3xl -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3 text-sm text-primary-400 font-bold uppercase tracking-wider">
                <span>{course.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>{course.subject}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight b-text">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center"><User className="mr-2 h-4 w-4" /> ১০ বছর অভিজ্ঞ টিউটর</div>
                <div className="flex items-center"><BookOpen className="mr-2 h-4 w-4" /> ১২ টি লাইভ ক্লাস</div>
                <div className="flex items-center"><Clock className="mr-2 h-4 w-4" /> ২০ ঘণ্টার ভিডিও কনটেন্ট</div>
              </div>
            </div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-3xl p-4 shadow-2xl shadow-black/50 text-slate-900 border border-slate-700/10"
            >
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative group">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <PlayCircle className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="px-2 space-y-6">
                <div className="flex items-end gap-3 font-bengali">
                  <span className="text-4xl font-bold text-primary-600">৳{course.discountPrice || course.price}</span>
                  {course.discountPrice && (
                    <span className="text-lg text-slate-400 line-through mb-1">৳{course.price}</span>
                  )}
                </div>
                
                {isEnrolled ? (
                  <Link to="/dashboard" className="w-full block text-center bg-primary-600 text-white font-bold py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                    কোর্সটি দেখতে ড্যাশবোর্ডে যান
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
                  >
                    {enrolling ? 'প্রসেসিং হচ্ছে...' : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        <span>কোর্সটি কিনুন</span>
                      </>
                    )}
                  </button>
                )}
                
                <div className="space-y-3 text-sm font-medium text-slate-600">
                  <p className="flex items-center"><CheckCircle className="mr-3 h-4 w-4 text-green-500" /> আজীবন মেম্বারশিপ</p>
                  <p className="flex items-center"><CheckCircle className="mr-3 h-4 w-4 text-green-500" /> মোবাইল এবং ল্যাপটপ থেকে এক্সেস</p>
                  <p className="flex items-center"><CheckCircle className="mr-3 h-4 w-4 text-green-500" /> কোর্স শেষে সার্টিফিকেট</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">কোর্স সম্পর্কে বিস্তারিত</h2>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4 whitespace-pre-wrap">
                {course.description}
              </div>
            </section>

            {/* Curriculum */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">কোর্স মডিউল</h2>
                <span className="text-sm text-slate-500 font-medium">{lessons.length} টি লেসন</span>
              </div>
              <div className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <div 
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                        {isEnrolled || lesson.isFree ? (
                          <PlayCircle className="h-5 w-5 text-slate-400 group-hover:text-primary-600 transition-colors" />
                        ) : (
                          <Lock className="h-4 w-4 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lesson {idx + 1}</span>
                        <h4 className="font-bold text-slate-700 leading-tight">{lesson.title}</h4>
                      </div>
                    </div>
                    {lesson.isFree && !isEnrolled && (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase tracking-wider">Free Preview</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Instructor Info */}
          <div className="space-y-8">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
              <div className="w-24 h-24 rounded-full bg-primary-100 mx-auto mb-6 flex items-center justify-center overflow-hidden border-4 border-slate-50">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zunayed" 
                  alt="Instructor" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900">জুনায়েদ আহমেদ</h3>
              <p className="text-sm text-slate-500 mb-6">ফাউন্ডার, জুনায়েদ একাডেমি</p>
              <div className="text-sm text-slate-600 mb-8 leading-relaxed">
                জুনায়েদ আহমেদ গত ৫ বছর ধরে এসএসসি ও এইচএসসি পর্যায়ের শিক্ষার্থীদের পড়িয়ে আসছেন। তার সহজ ভাবে উপস্থাপনা হাজারো শিক্ষার্থীর প্রিয়।
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-400 uppercase">
                <div>
                  <div className="text-slate-900 text-lg mb-1">১২০০+</div>
                  সফল ছাত্র
                </div>
                <div>
                  <div className="text-slate-900 text-lg mb-1">১৫টি</div>
                  কোর্স
                </div>
              </div>
            </section>

            <section className="bg-primary-950 rounded-3xl p-8 text-white">
              <h3 className="text-lg font-bold mb-4">কোন সাহায্য প্রয়োজন?</h3>
              <p className="text-sm text-primary-200 mb-6 leading-relaxed">
                আমাদের কোর্স নিয়ে কোন প্রশ্ন থাকলে অথবা ভর্তি হতে কোন সমস্যা হলে আমাদের কল করুন।
              </p>
              <div className="space-y-4 font-bold">
                <a href="tel:+8801700000000" className="flex items-center gap-3 hover:text-primary-400 transition-colors">
                  <span className="bg-white/10 p-2 rounded-lg"><Clock className="h-5 w-5" /></span>
                  <span>+৮৮০ ১৭০০-০০০০০০</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
