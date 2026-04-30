import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile, Course, CourseStatus } from '../types';
import { Users, BookOpen, Shield, TrendingUp, Check, X, Database, ShoppingBag, Book as BookIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const fetchData = async () => {
    try {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
      setUsers(usersData);

      // Fetch courses
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      setCourses(coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));

      // Fetch products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      setProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch ebooks
      const ebooksSnapshot = await getDocs(collection(db, 'ebooks'));
      setEbooks(ebooksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      
      setStatusMessage({ type: 'success', text: 'ডামি কোর্সগুলো সফলভাবে যুক্ত করা হয়েছে!' });
      fetchData();
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'কিছু একটা সমস্যা হয়েছে।' });
    } finally {
      setIsSeeding(false);
    }
  };

  const seedDummyData = async () => {
    setIsSeeding(true);
    setStatusMessage(null);
    try {
      const dummyProducts = [
        { title: 'প্রিমিয়াম স্টাডি কিট', price: 1500, category: 'Essential', image: 'https://images.unsplash.com/photo-1544816153-0975b779a6cd?w=400', rating: 4.8, desc: 'সম্পূর্ণ স্টাডি প্যাক।' },
        { title: 'স্মার্ট ক্যালকুলেটর', price: 1200, category: 'Tools', image: 'https://images.unsplash.com/photo-1574607383476-f517f220d1c0?w=400', rating: 4.9, desc: 'অ্যাডভান্সড ক্যালকুলেটর।' }
      ];
      const dummyEbooks = [
        { title: 'HSC রসায়ন ১ম পত্র নোট', price: 150, pages: 320, image: 'https://images.unsplash.com/photo-1543003919-a995d5225d62?w=400', rating: 4.9, author: 'জুনায়েদ আহমেদ', desc: 'মাস্টার নোট।' },
        { title: 'ইংলিশ গ্রামার মাস্টার ক্লাস', price: 200, pages: 450, image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=400', rating: 5.0, author: 'তামান্না ফাহমি', desc: 'গ্রামার গাইড।' }
      ];

      for (const p of dummyProducts) await addDoc(collection(db, 'products'), p);
      for (const e of dummyEbooks) await addDoc(collection(db, 'ebooks'), e);
      
      setStatusMessage({ type: 'success', text: 'পণ্য ও ই-বুক সফলভাবে যুক্ত করা হয়েছে!' });
      fetchData();
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'কিছু একটা সমস্যা হয়েছে।' });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-12 relative z-10">
      {statusMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-24 right-8 z-[60] p-4 rounded-2xl shadow-xl border ${
            statusMessage.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-red-500 text-white border-red-400'
          }`}
        >
          {statusMessage.text}
        </motion.div>
      )}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 bg-white  p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-50 transition-colors"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-50 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-50 transition-colors"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary-600 mb-3">অ্যাডমিন কন্ট্রোল</h1>
          <p className="text-slate-500 font-medium text-lg">একাডেমির সকল মডিউল ও ইউজার পরিচালনা করুন</p>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={seedDummyCourses}
              disabled={isSeeding}
              className="flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-sm transition-all disabled:opacity-50 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>{isSeeding ? 'লোডিং...' : 'ডামি কোর্স যুক্ত করুন'}</span>
              </span>
            </button>
            <button 
              onClick={seedDummyData}
              disabled={isSeeding}
              className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-primary-600/5 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>{isSeeding ? 'লোডিং...' : 'শপ ডাটাসমূহ যুক্ত করুন'}</span>
              </span>
            </button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative hidden lg:block z-10 filter drop-shadow-sm"
        >
          <img 
            src="https://img.freepik.com/free-vector/3d-cartoon-online-registration-concept_107791-16477.jpg" 
            alt="Admin illustration"
            className="w-56 h-56 object-contain rounded-2xl"
          />
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white  p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-primary-100 transition-all relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary-50 transition-colors"></div>
          <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 group-hover:scale-110 transition-transform border border-primary-100"><Users className="h-8 w-8" /></div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 font-sans">{users.length}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">মোট ইউজার</div>
          </div>
        </div>
        <div className="bg-white  p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-400/30 transition-all relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-400/10 transition-colors"></div>
          <div className="bg-emerald-400/10 p-4 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform border border-emerald-400/20"><BookOpen className="h-8 w-8" /></div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 font-sans">{courses.length}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">মোট কোর্স</div>
          </div>
        </div>
        <div className="bg-white  p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-blue-400/30 transition-all relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-400/10 transition-colors"></div>
          <div className="bg-blue-400/10 p-4 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform border border-blue-400/20"><ShoppingBag className="h-8 w-8" /></div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 font-sans">{products.length}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">মোট পণ্য</div>
          </div>
        </div>
        <div className="bg-white  p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-400/30 transition-all relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-indigo-400/10 transition-colors"></div>
          <div className="bg-indigo-400/10 p-4 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform border border-indigo-400/20"><BookIcon className="h-8 w-8" /></div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 font-sans">{ebooks.length}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">মোট ই-বুক</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* User Management */}
        <section className="bg-white  rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-transparent pointer-events-none z-0"></div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900 relative z-10">
            <Users className="h-5 w-5 text-primary-600" />
            ইউজার ম্যানেজমেন্ট
          </h2>
          <div className="space-y-4 relative z-10">
            {users.slice(0, 5).map((u) => (
              <div key={u.uid} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center font-bold text-primary-600 shadow-sm">
                    {u.displayName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{u.displayName}</h4>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase py-1 px-2 rounded-md border ${
                  u.role === 'admin' ? 'bg-rose-400/10 text-rose-400 border-rose-400/20' : 'bg-slate-500/10 text-slate-600 border-slate-500/20'
                }`}>
                  {u.role === 'admin' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Course Approvals */}
        <section className="bg-white  rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-bl from-brand-purple/5 to-transparent pointer-events-none z-0"></div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900 relative z-10">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            কোর্স অ্যাপ্রুভাল
          </h2>
          <div className="space-y-4 relative z-10">
            {courses.filter(c => c.status === CourseStatus.DRAFT || c.status === CourseStatus.PENDING).map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-14 bg-slate-50 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
                    <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{c.title}</h4>
                    <p className="text-[10px] text-primary-600 bg-primary-50 border border-primary-100 px-1 inline-block rounded uppercase font-bold tracking-wider mt-1">{c.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => approveCourse(c.id)}
                    className="p-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-lg hover:bg-emerald-400/20 hover:border-emerald-400/50 transition-colors shadow-sm"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-rose-400/10 border border-rose-400/20 text-rose-400 rounded-lg hover:bg-rose-400/20 hover:border-rose-400/50 transition-colors shadow-sm">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {courses.filter(c => c.status !== CourseStatus.PUBLISHED).length === 0 && (
              <div className="py-10 text-center text-slate-500 text-sm">কোন পেন্ডিং কোর্স নেই।</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
