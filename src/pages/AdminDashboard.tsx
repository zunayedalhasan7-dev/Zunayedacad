import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile, Course, CourseStatus } from '../types';
import { Users, BookOpen, Shield, TrendingUp, Check, X, Database } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch users from backend API for security (RBAC enforcement & scrubbing)
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      } else {
        console.error('Failed to fetch users from API');
      }

      // Courses can still be fetched via Firestore if public/semi-public
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      setCourses(coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveCourse = async (courseId: string) => {
    try {
      await updateDoc(doc(db, 'courses', courseId), { status: CourseStatus.PUBLISHED });
      setCourses(courses.map(c => c.id === courseId ? { ...c, status: CourseStatus.PUBLISHED } : c));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `courses/${courseId}`);
    }
  };

  const seedDummyCourses = async () => {
    setIsSeeding(true);
    try {
      const dummyCourses = [
        {
          title: 'SSC গণিত পূর্ণাঙ্গ প্রস্তুতি ২০২৪',
          description: 'এসএসসি পরীক্ষার্থীদের জন্য গণিতের প্রতিটি চ্যাপ্টারের সহজ সমাধান ও বিশেষ টিপস।',
          thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60',
          price: 1500,
          category: 'SSC',
          instructorId: 'dummy-instructor-1',
          instructorName: 'জুনায়েদ আহমেদ',
          status: CourseStatus.PUBLISHED,
          createdAt: serverTimestamp(),
          modules: [],
          studentsEnrolled: 120
        },
        {
          title: 'HSC রসায়ন ১ম পত্র',
          description: 'জৈব রসায়ন থেকে শুরু করে রাসায়নিক পরিবর্তন - সবকিছুই এবার হাতের মুঠোয়।',
          thumbnail: 'https://images.unsplash.com/photo-1532187875605-2fe358a71408?w=800&auto=format&fit=crop&q=60',
          price: 2000,
          category: 'HSC',
          instructorId: 'dummy-instructor-2',
          instructorName: 'সাদিয়া ইসলাম',
          status: CourseStatus.PUBLISHED,
          createdAt: serverTimestamp(),
          modules: [],
          studentsEnrolled: 85
        },
        {
          title: 'প্রফেশনাল গ্রাফিক ডিজাইন কোর্স',
          description: 'অ্যাডোবি ফটোশপ এবং ইলাস্ট্রেটর শিখে ফ্রিল্যান্সিং ক্যারিয়ার শুরু করুন।',
          thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60',
          price: 3500,
          category: 'Skills',
          instructorId: 'dummy-instructor-3',
          instructorName: 'তানজিল হাসান',
          status: CourseStatus.PUBLISHED,
          createdAt: serverTimestamp(),
          modules: [],
          studentsEnrolled: 250
        },
        {
          title: 'স্পোকেন ইংলিশ মাস্টারক্লাস',
          description: 'দৈনন্দিন জীবনে ইংরেজি বলার জড়তা কাটিয়ে উঠুন মাত্র ৩০ দিনে।',
          thumbnail: 'https://images.unsplash.com/photo-1543167664-40d6994796a1?w=800&auto=format&fit=crop&q=60',
          price: 1200,
          category: 'Skills',
          instructorId: 'dummy-instructor-4',
          instructorName: 'তামান্না ফাহমি',
          status: CourseStatus.PUBLISHED,
          createdAt: serverTimestamp(),
          modules: [],
          studentsEnrolled: 450
        }
      ];

      for (const course of dummyCourses) {
        await addDoc(collection(db, 'courses'), course);
      }
      
      alert('ডামি কোর্সগুলো সফলভাবে যুক্ত করা হয়েছে!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('কিছু একটা সমস্যা হয়েছে।');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">অ্যাডমিন কন্ট্রোল</h1>
          <p className="text-slate-500 font-medium text-lg">একাডেমির সকল মডিউল ও ইউজার পরিচালনা করুন</p>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={seedDummyCourses}
              disabled={isSeeding}
              className="flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-200"
            >
              <Database className="h-5 w-5" />
              <span>{isSeeding ? 'লোডিং...' : 'ডামি কোর্স যুক্ত করুন'}</span>
            </button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative hidden lg:block"
        >
          <img 
            src="https://img.freepik.com/free-vector/3d-cartoon-online-registration-concept_107791-16477.jpg" 
            alt="Admin illustration"
            className="w-56 h-56 object-contain"
          />
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-primary-100/20 transition-all">
          <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 group-hover:scale-110 transition-transform"><Users className="h-8 w-8" /></div>
          <div>
            <div className="text-3xl font-bold text-slate-900">{users.length}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">মোট ইউজার</div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-green-100/20 transition-all">
          <div className="bg-green-50 p-4 rounded-2xl text-green-600 group-hover:scale-110 transition-transform"><BookOpen className="h-8 w-8" /></div>
          <div>
            <div className="text-3xl font-bold text-slate-900">{courses.length}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">মোট কোর্স</div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-orange-100/20 transition-all">
          <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform"><Shield className="h-8 w-8" /></div>
          <div>
            <div className="text-3xl font-bold text-slate-900">১২</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">পেন্ডিং রিভিউ</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* User Management */}
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Users className="h-5 w-5 text-primary-600" />
            ইউজার ম্যানেজমেন্ট
          </h2>
          <div className="space-y-4">
            {users.slice(0, 5).map((u) => (
              <div key={u.uid} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600">
                    {u.displayName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">{u.displayName}</h4>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase py-1 px-2 rounded-md ${
                  u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-slate-200 text-slate-500'
                }`}>
                  {u.role === 'admin' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Course Approvals */}
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            কোর্স অ্যাপ্রুভাল
          </h2>
          <div className="space-y-4">
            {courses.filter(c => c.status === CourseStatus.DRAFT || c.status === CourseStatus.PENDING).map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-14 bg-white rounded-lg overflow-hidden border border-slate-200">
                    <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm line-clamp-1">{c.title}</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{c.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => approveCourse(c.id)}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {courses.filter(c => c.status !== CourseStatus.PUBLISHED).length === 0 && (
              <div className="py-10 text-center text-slate-400 text-sm">কোন পেন্ডিং কোর্স নেই।</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
