import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) return;
      
      try {
        const enrollQuery = query(collection(db, 'enrollments'), where('userId', '==', user.uid));
        const enrollSnapshot = await getDocs(enrollQuery);
        const enrollments = enrollSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment));
        
        const courseData: EnrolledCourse[] = [];
        for (const enroll of enrollments) {
          const courseDoc = await getDocs(query(collection(db, 'courses'), where('id', '==', enroll.courseId)));
          if (!courseDoc.empty) {
            const course = courseDoc.docs[0].data() as Course;
            courseData.push({
              ...course,
              enrollmentId: enroll.id,
              progress: enroll.progress || 0
            });
          }
        }
        setEnrolledCourses(courseData);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'enrollments');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-2xl bg-primary-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName} className="h-full w-full object-cover" />
            ) : (
              <Award className="h-8 w-8 text-primary-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">আসসালামু আলাইকুম, {profile?.displayName || 'শিক্ষার্থী'}!</h1>
            <p className="text-slate-500 text-sm">আপনার শেখার এই যাত্রা শুভ হোক। আজকে নতুন কি শিখবেন?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">মোট কোর্স</div>
            <div className="text-2xl font-bold text-slate-900">{enrolledCourses.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">সার্টিফিকেট</div>
            <div className="text-2xl font-bold text-slate-900">০</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">চালমান কোর্সসমূহ</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ x: 4 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col sm:flex-row p-4 gap-4"
              >
                <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden shrink-0">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                    <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded uppercase">{course.category}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-500">প্রগ্রেস</span>
                      <span className="text-primary-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        className="bg-primary-600 h-full rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-slate-400">
                      <Clock className="h-3 w-3 mr-1" /> শেষ দেখা: ২ দিন আগে
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors"
                    >
                      চালিয়ে যান <Play className="h-3 w-3 ml-2 fill-white" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border shadow-sm border-slate-100">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 w-64 h-64 mx-auto"
            >
              <DashboardIllustration />
            </motion.div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">আপনি কোন কোর্সে ইনরোল করেননি</h3>
            <p className="text-slate-500 mb-6 font-medium">শিখতে শুরু করতে আমাদের কোর্সসমূহ দেখুন</p>
            <Link to="/courses" className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all inline-flex items-center shadow-lg shadow-primary-200 group">
              কোর্স এক্সপ্লোর করুন <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
