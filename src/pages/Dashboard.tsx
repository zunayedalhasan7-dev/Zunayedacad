import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Enrollment, Course } from '../types';
import { BookOpen, Clock, Award, Play, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { DashboardIllustration } from '../components/Illustrations';

interface EnrolledCourse extends Course {
  enrollmentId: string;
  progress: number;
  lastAccessedAt?: any;
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Enrollment Listener
    const enrollQuery = query(collection(db, 'enrollments'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(enrollQuery, async (snapshot) => {
      const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment));
      
      try {
        // Fetch Course data for each enrollment
        const courseData: EnrolledCourse[] = [];
        for (const enroll of enrollments) {
          try {
            const courseDoc = await getDoc(doc(db, 'courses', enroll.courseId));
            if (courseDoc.exists()) {
              const course = { id: courseDoc.id, ...courseDoc.data() } as Course;
              courseData.push({
                ...course,
                enrollmentId: enroll.id,
                progress: enroll.progress || 0,
                lastAccessedAt: enroll.lastAccessedAt
              });
            }
          } catch (courseErr) {
            console.error(`Error fetching course ${enroll.courseId}:`, courseErr);
          }
        }
        setEnrolledCourses(courseData);
      } catch (err) {
        console.error('Dashboard courses fetch error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="space-y-10 relative z-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 px-1 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-primary-50 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName} className="h-full w-full object-cover rounded-xl" />
            ) : (
              <Award className="h-8 w-8 text-primary-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">আসসালামু আলাইকুম, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">{profile?.displayName || 'শিক্ষার্থী'}!</span></h1>
            <p className="text-slate-500 text-sm">আপনার শেখার এই যাত্রা শুভ হোক। আজকে নতুন কি শিখবেন?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white  p-4 rounded-xl border border-slate-200 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary-50 border blur-[40px] opacity-20"></div>
            <div className="text-xs font-bold text-slate-500 uppercase mb-1">মোট কোর্স</div>
            <div className="text-2xl font-bold font-sans text-primary-600">{enrolledCourses.length}</div>
          </div>
          <div className="bg-white  p-4 rounded-xl border border-slate-200 shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-16 h-16 bg-primary-50 border blur-[40px] opacity-20"></div>
            <div className="text-xs font-bold text-slate-500 uppercase mb-1">সার্টিফিকেট</div>
            <div className="text-2xl font-bold font-sans text-primary-600">০</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">চালমান কোর্সসমূহ</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-slate-200" />)}
          </div>
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row p-4 gap-4 relative group hover:shadow-md transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden shrink-0 shadow-inner">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-3 relative z-10">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                      <span className="text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded shadow-sm uppercase">{course.category}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-500">প্রগ্রেস</span>
                        <span className="text-primary-600 font-sans">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-200">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          className="bg-primary-600 h-full rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" /> শেষ দেখা: {course.lastAccessedAt ? (() => {
                           const lastTime = course.lastAccessedAt.toDate().getTime();
                           const diffInMinutes = Math.floor((now - lastTime) / (1000 * 60));
                           if (diffInMinutes < 1) return 'এইমাত্র';
                           if (diffInMinutes < 60) return `${diffInMinutes} মিনিট আগে`;
                           const diffInHours = Math.floor(diffInMinutes / 60);
                           if (diffInHours < 24) return `${diffInHours} ঘণ্টা আগে`;
                           const diffInDays = Math.floor(diffInHours / 24);
                           return `${diffInDays} দিন আগে`;
                        })() : 'কখনো দেখেননি'}
                      </div>
                      <span
                        className="flex items-center bg-slate-100 border border-slate-200 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-50 hover:border-primary-100 hover:shadow-sm transition-all"
                      >
                        চালিয়ে যান <Play className="h-3 w-3 ml-2 fill-current" />
                      </span>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white  rounded-3xl p-12 text-center border shadow-2xl border-slate-200 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 to-transparent pointer-events-none z-0"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 w-64 h-64 mx-auto relative z-10 filter drop-shadow-sm"
            >
              <DashboardIllustration />
            </motion.div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">আপনি কোন কোর্সে ইনরোল করেননি</h3>
            <p className="text-slate-500 mb-6 font-medium relative z-10">শিখতে শুরু করতে আমাদের কোর্সসমূহ দেখুন</p>
            <Link to="/courses" className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-sm transition-all inline-flex items-center relative z-10 overflow-hidden group/btn">
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out"></div>
              <span className="relative z-10 flex items-center">কোর্স এক্সপ্লোর করুন <ChevronRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" /></span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
