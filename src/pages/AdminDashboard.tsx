import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, Course, CourseStatus, UserRole, Lesson } from '../types';
import { Users, BookOpen, Shield, TrendingUp, Check, X, Database, ShoppingBag, Book as BookIcon, Search, CreditCard, Filter, MoreVertical, Trash2, ShieldAlert, BadgeCheck, Play, Plus, ListOrdered, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 'overview' | 'users' | 'courses' | 'payments' | 'products' | 'ebooks';

export default function AdminDashboard() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>((tab as AdminTab) || 'overview');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Lesson Management State
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<Course | null>(null);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    moduleId: '',
    videoUrl: '',
    isFree: false,
    order: 0,
    description: ''
  });
  
  // Form States for Add Modal
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    thumbnail: '',
    instructorName: '',
    pages: 0, // for ebook
    author: '', // for ebook
    stock: 0, // for product
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (tab && ['overview', 'users', 'courses', 'payments', 'products', 'ebooks'].includes(tab)) {
      setActiveTab(tab as AdminTab);
    } else if (!tab) {
      setActiveTab('overview');
    }
  }, [tab]);

  const handleTabChange = (newTab: AdminTab) => {
    if (newTab === 'overview') {
      navigate('/admin');
    } else {
      navigate(`/admin/${newTab}`);
    }
    setSearchTerm('');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      let usersData: UserProfile[] = [];
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        usersData = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
        setUsers(usersData);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'users');
      }

      // Fetch courses (ordered by creation)
      try {
        const coursesQuery = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
        const coursesSnapshot = await getDocs(coursesQuery);
        setCourses(coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'courses');
      }

      // Fetch payments
      try {
        const paymentsQuery = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
        const paymentsSnapshot = await getDocs(paymentsQuery);
        setPayments(paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'payments');
      }

      // Fetch products
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        setProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'products');
      }

      // Fetch ebooks
      try {
        const ebooksSnapshot = await getDocs(collection(db, 'ebooks'));
        setEbooks(ebooksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'ebooks');
      }
    } catch (err) {
      console.error("Admin Dashboard data fetch error:", err);
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
      setStatusMessage({ type: 'success', text: 'কোর্সটি সফলভাবে পাবলিশ করা হয়েছে।' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `courses/${courseId}`);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে আপনি এই ইউজারটি ডিলিট করতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(u => u.uid !== userId));
      setStatusMessage({ type: 'success', text: 'ইউজার সফলভাবে ডিলিট করা হয়েছে।' });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${userId}`);
    }
  };

  const updateUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === UserRole.ADMIN ? UserRole.STUDENT : UserRole.ADMIN;
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.uid === userId ? { ...u, role: newRole } : u));
      setStatusMessage({ type: 'success', text: `ইউজার রোল ${newRole === UserRole.ADMIN ? 'অ্যাডমিন' : 'শিক্ষার্থী'} এ পরিবর্তন করা হয়েছে।` });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে আপনি এই কোর্সটি ডিলিট করতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      setCourses(courses.filter(c => c.id !== courseId));
      setStatusMessage({ type: 'success', text: 'কোর্স সফলভাবে ডিলিট করা হয়েছে।' });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `courses/${courseId}`);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      const lessonsQuery = query(collection(db, 'courses', courseId, 'lessons'), orderBy('order', 'asc'));
      const snapshot = await getDocs(lessonsQuery);
      setCourseLessons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson)));
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `courses/${courseId}/lessons`);
    }
  };

  const saveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForLessons) return;
    
    setLoading(true);
    try {
      if (editingLessonId) {
        await updateDoc(doc(db, 'courses', selectedCourseForLessons.id, 'lessons', editingLessonId), {
          ...lessonFormData,
          updatedAt: serverTimestamp()
        });
        setStatusMessage({ type: 'success', text: 'লেসন সফলভাবে আপডেট করা হয়েছে!' });
      } else {
        await addDoc(collection(db, 'courses', selectedCourseForLessons.id, 'lessons'), {
          ...lessonFormData,
          courseId: selectedCourseForLessons.id,
          createdAt: serverTimestamp()
        });
        setStatusMessage({ type: 'success', text: 'লেসন সফলভাবে যুক্ত করা হয়েছে!' });
      }
      
      setEditingLessonId(null);
      setIsAddingLesson(false);
      setLessonFormData({ title: '', moduleId: '', videoUrl: '', isFree: false, order: courseLessons.length + (editingLessonId ? 0 : 1), description: '' });
      fetchLessons(selectedCourseForLessons.id);
    } catch (err) {
      handleFirestoreError(err, editingLessonId ? OperationType.UPDATE : OperationType.CREATE, 'lessons');
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!selectedCourseForLessons || !window.confirm('আপনি কি নিশ্চিত যে এই লেসনটি ডিলিট করতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'courses', selectedCourseForLessons.id, 'lessons', lessonId));
      setStatusMessage({ type: 'success', text: 'লেসন ডিলিট করা হয়েছে।' });
      fetchLessons(selectedCourseForLessons.id);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `lessons/${lessonId}`);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let collectionName = '';
      let data: any = { 
        ...formData, 
        createdAt: serverTimestamp(),
        rating: 5.0 
      };

      if (activeTab === 'courses') {
        collectionName = 'courses';
        data.status = CourseStatus.PUBLISHED;
        data.studentsEnrolled = 0;
        data.modules = [];
      } else if (activeTab === 'products') {
        collectionName = 'products';
        data.image = formData.thumbnail;
        data.desc = formData.description;
      } else if (activeTab === 'ebooks') {
        collectionName = 'ebooks';
        data.image = formData.thumbnail;
        data.desc = formData.description;
      }

      await addDoc(collection(db, collectionName), data);
      setStatusMessage({ type: 'success', text: 'সফলভাবে যুক্ত করা হয়েছে!' });
      setIsAdding(false);
      setFormData({
        title: '', description: '', price: 0, category: '', 
        thumbnail: '', instructorName: '', pages: 0, author: '', stock: 0
      });
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, activeTab);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string, collectionName: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এটি ডিলিট করতে চান?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      setStatusMessage({ type: 'success', text: 'সফলভাবে ডিলিট করা হয়েছে।' });
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  const seedDummyData = async () => {
    setIsSeeding(true);
    setStatusMessage(null);
    try {
      const dummyPayments = [
        { 
          userId: 'dummy-user-1', 
          userName: 'রাকিব হাসান', 
          amount: 1500, 
          courseTitle: 'SSC গণিত পূর্ণাঙ্গ প্রস্তুতি', 
          method: 'bkash', 
          txId: 'BKASH789XYZ', 
          status: 'completed', 
          createdAt: serverTimestamp() 
        },
        { 
          userId: 'dummy-user-2', 
          userName: 'মারিয়া আক্তার', 
          amount: 2000, 
          courseTitle: 'HSC রসায়ন ১ম পত্র', 
          method: 'nagad', 
          txId: 'NGD456ABC', 
          status: 'completed', 
          createdAt: serverTimestamp() 
        }
      ];

      for (const p of dummyPayments) await addDoc(collection(db, 'payments'), p);
      
      setStatusMessage({ type: 'success', text: 'ডামি পেমেন্ট হিস্ট্রি যুক্ত করা হয়েছে!' });
      fetchData();
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'কিছু একটা সমস্যা হয়েছে।'});
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCourses = courses.filter(c => 
    (c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPayments = payments.filter(p => 
    (p.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.txId?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-12 relative pb-20">
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

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6 md:mb-8 bg-white p-5 md:p-8 lg:p-12 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-50 transition-colors"></div>
        <div className="relative z-10 w-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary-600 mb-2 md:mb-3 tracking-tight">অ্যাডমিন ড্যাশবোর্ড</h1>
          <p className="text-slate-500 font-bold text-sm md:text-base lg:text-lg">পুরো একাডেমির কার্যক্রম এক জায়গা থেকে পরিচালনা করুন</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto relative z-10">
          <button 
            onClick={seedDummyData}
            disabled={isSeeding}
            className="flex items-center justify-center space-x-2 bg-slate-900 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black hover:bg-slate-800 transition-all disabled:opacity-50 text-xs md:text-sm w-full sm:w-auto shadow-lg"
          >
            <Database className="h-4 w-4" />
            <span>{isSeeding ? 'লোডিং...' : 'ডামি ডাটা রিসেট'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col gap-6 md:gap-8">
        {/* Tab Navigation */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 p-1.5 md:p-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full no-scrollbar">
            {(['overview', 'users', 'courses', 'payments', 'products', 'ebooks'] as AdminTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-black text-xs md:text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'bg-primary-600 text-white shadow-md scale-[1.02]' 
                    : 'text-slate-500 hover:bg-primary-50'
                }`}
              >
                {tab === 'overview' && <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                {tab === 'users' && <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                {tab === 'courses' && <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                {tab === 'payments' && <CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                {tab === 'products' && <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                {tab === 'ebooks' && <BookIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                <span className="hidden sm:inline">
                  {tab === 'overview' ? 'ওভারভিউ' : 
                   tab === 'users' ? 'ইউজার' : 
                   tab === 'courses' ? 'কোর্স' : 
                   tab === 'payments' ? 'পেমেন্ট' :
                   tab === 'products' ? 'শপ' : 'ই-বুক'}
                </span>
                <span className="sm:hidden">
                  {tab === 'overview' ? 'ওভারভিউ' : 
                   tab === 'users' ? 'ইউজার' : 
                   tab === 'courses' ? 'কোর্স' : 
                   tab === 'payments' ? 'পেমেন্ট' :
                   tab === 'products' ? 'শপ' : 'ই-বুক'}
                </span>
              </button>
            ))}
          </div>

          {['courses', 'products', 'ebooks'].includes(activeTab) && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black hover:shadow-xl transition-all shadow-sm active:scale-95 text-sm md:text-base"
            >
              <Check className="h-4 w-4 md:h-5 md:w-5" />
              <span>নতুন {activeTab === 'courses' ? 'কোর্স' : activeTab === 'products' ? 'প্রোডাক্ট' : 'ই-বুক'}</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  <StatCard icon={Users} label="মোট ইউজার" value={users.length} color="primary" />
                  <StatCard icon={BookOpen} label="মোট কোর্স" value={courses.length} color="emerald" />
                  <StatCard icon={CreditCard} label="মোট পেমেন্ট" value={payments.length} color="blue" />
                  <StatCard icon={TrendingUp} label="মোট লাভ (৳)" value={payments.reduce((acc, p) => acc + (p.amount || 0), 0)} color="rose" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                   {/* Recent Users */}
                  <section className="bg-white rounded-[1.5rem] md:rounded-3xl p-5 md:p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                      <h2 className="text-lg md:text-xl font-black flex items-center gap-2 md:gap-3 text-slate-900 uppercase tracking-tight">
                        <Users className="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
                        নতুন ইউজারসমূহ
                      </h2>
                      <button onClick={() => setActiveTab('users')} className="text-primary-600 text-[10px] md:text-xs font-black hover:underline px-3 md:px-4 py-1.5 md:py-2 bg-primary-50 rounded-lg md:rounded-xl transition-all">সব দেখুন</button>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      {users.slice(0, 5).map((u) => (
                        <div key={u.uid} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center font-black text-primary-600 shadow-sm uppercase text-xs md:text-base">
                              {u.displayName?.charAt(0) || u.email.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 text-xs md:text-sm tracking-tight line-clamp-1">{u.displayName || 'Unnamed'}</h4>
                              <p className="text-[10px] md:text-xs text-slate-500 font-bold line-clamp-1">{u.email}</p>
                            </div>
                          </div>
                          <span className={`text-[8px] md:text-[10px] font-black uppercase py-1 md:py-1.5 px-2 md:px-3 rounded-md md:rounded-lg border shadow-sm ${
                            u.role === 'admin' ? 'bg-rose-500 text-white border-rose-400' : 'bg-white text-slate-600 border-slate-200'
                          }`}>
                            {u.role === 'admin' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Course Approvals */}
                  <section className="bg-white rounded-[1.5rem] md:rounded-3xl p-5 md:p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                      <h2 className="text-lg md:text-xl font-black flex items-center gap-2 md:gap-3 text-slate-900 uppercase tracking-tight">
                        <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                        কোর্স অ্যাপ্রুভাল
                      </h2>
                      <button onClick={() => setActiveTab('courses')} className="text-emerald-600 text-[10px] md:text-xs font-black hover:underline px-3 md:px-4 py-1.5 md:py-2 bg-emerald-50 rounded-lg md:rounded-xl transition-all">ম্যানেজ কোর্স</button>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      {courses.filter(c => c.status !== CourseStatus.PUBLISHED).slice(0, 5).map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="h-8 w-12 md:h-10 md:w-14 bg-white rounded-lg overflow-hidden border border-slate-200 shrink-0">
                              <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 text-xs md:text-sm line-clamp-1 tracking-tight">{c.title}</h4>
                              <p className="text-[8px] md:text-[10px] text-primary-600 bg-primary-100/50 border border-primary-200 px-1.5 md:px-2 inline-block rounded-md uppercase font-black tracking-widest mt-1">{c.category}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5 md:gap-2">
                            <button 
                              onClick={() => approveCourse(c.id)}
                              className="p-2 md:p-2.5 bg-emerald-500 text-white rounded-lg md:rounded-xl hover:bg-emerald-600 transition-all shadow-sm"
                            >
                              <Check className="h-3 md:h-4 w-3 md:w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {courses.filter(c => c.status !== CourseStatus.PUBLISHED).length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                          <Check className="h-8 w-8 mb-3 opacity-20" />
                          <p className="text-sm font-bold">কোন পেন্ডিং কোর্স নেই</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-5 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
                  <div className="w-full sm:w-auto">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">ইউজার লিস্ট</h2>
                    <p className="text-xs md:text-sm font-bold text-slate-500">ইউজারদের প্রোফাইল ও অ্যাক্সেস কন্ট্রোল করুন</p>
                  </div>
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="ইউজার খুঁজুন..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-100 font-bold transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ইউজার</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">রোল</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">জয়েনিং ডেট</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary-100 flex items-center justify-center font-black text-primary-600 shadow-sm uppercase text-xs">
                                {u.displayName?.charAt(0) || u.email?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 tracking-tight text-sm md:text-base">{u.displayName || 'Unnamed'}</div>
                                <div className="text-[10px] md:text-xs text-slate-500 font-medium">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <span className={`text-[9px] md:text-[10px] font-black uppercase py-1 md:py-1.5 px-2 md:px-3 rounded-lg border shadow-sm flex items-center gap-1.5 w-fit ${
                              u.role === 'admin' ? 'bg-rose-500 text-white border-rose-400' : 'bg-white text-slate-600 border-slate-200'
                            }`}>
                              {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                              {u.role === 'admin' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <span className="text-[10px] md:text-xs font-bold text-slate-500">{u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5 text-right">
                            <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => updateUserRole(u.uid, u.role)}
                                className="p-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-primary-600 hover:text-white transition-all shadow-sm active:scale-95"
                              >
                                {u.role === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <BadgeCheck className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => deleteUser(u.uid)}
                                className="p-2 border border-slate-200 bg-white text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="py-24 text-center text-slate-400 font-bold">কোন ইউজার পাওয়া যায়নি</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-5 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
                  <div className="w-full sm:w-auto">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">কোর্স কন্ট্রোল প্যানেল</h2>
                    <p className="text-xs md:text-sm font-bold text-slate-500">কোর্স পাবলিশ ও স্থিতি মনিটর করুন</p>
                  </div>
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="কোর্স খুঁজুন..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-100 font-bold transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">কোর্স বিবরণ</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">শিক্ষক</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">স্ট্যাটাস</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">মূল্য</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCourses.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="h-10 w-16 md:h-12 md:w-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner shrink-0">
                                <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="font-black text-slate-900 tracking-tight text-sm md:text-base line-clamp-1">{c.title}</div>
                                <div className="text-[9px] md:text-[10px] font-black text-primary-600 bg-primary-100/30 px-2 py-0.5 rounded uppercase mt-1 border border-primary-600/10 inline-block">{c.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <div className="text-[11px] md:text-xs font-black text-slate-600">{c.instructorName}</div>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <span className={`text-[8px] md:text-[9px] font-black uppercase py-1 md:py-1 px-2 md:px-3 rounded-lg border shadow-sm inline-flex items-center gap-1.5 ${
                              c.status === CourseStatus.PUBLISHED ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-900 text-white border-slate-800'
                            }`}>
                              {c.status === CourseStatus.PUBLISHED ? <Check className="w-3 h-3" /> : <Filter className="w-3 h-3" />}
                              {c.status === CourseStatus.PUBLISHED ? 'প্রকাশিত' : 'ড্রাফট'}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <span className="text-sm font-black text-slate-900 font-sans">{c.price === 0 ? 'Free' : `৳${c.price}`}</span>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5 text-right">
                            <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setSelectedCourseForLessons(c);
                                  fetchLessons(c.id);
                                }}
                                className="p-2 border border-slate-200 bg-white text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-all shadow-sm active:scale-95"
                                title="Manage Lessons"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                              {c.status !== CourseStatus.PUBLISHED && (
                                <button 
                                  onClick={() => approveCourse(c.id)}
                                  className="p-2 border border-slate-200 bg-white text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => deleteCourse(c.id)}
                                className="p-2 border border-slate-200 bg-white text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCourses.length === 0 && (
                    <div className="py-24 text-center text-slate-400 font-bold">কোন কোর্স পাওয়া যায়নি</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-5 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
                  <div className="w-full sm:w-auto">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">পেমেন্ট হিস্ট্রি</h2>
                    <p className="text-xs md:text-sm font-bold text-slate-500">লেনদেনের তথ্য ও অডিট ট্রেইল</p>
                  </div>
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="পেমেন্ট খুঁজুন..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-100 font-bold transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ইউজার ও কোর্স</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ট্রানজেকশন ID</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">মেথড</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">পরিমাণ</th>
                        <th className="px-4 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">তারিখ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <div>
                              <div className="font-black text-slate-900 tracking-tight text-sm md:text-base">{p.userName}</div>
                              <div className="text-[10px] md:text-xs font-bold text-primary-600 line-clamp-1">{p.courseTitle}</div>
                            </div>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <span className="text-[10px] md:text-xs font-mono font-black text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">{p.txId}</span>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <span className="text-[10px] md:text-xs font-black uppercase text-slate-600 flex items-center gap-1.5 capitalize">
                              <div className={`w-2 h-2 rounded-full ${p.method === 'bkash' ? 'bg-pink-500' : 'bg-orange-500'}`}></div>
                              {p.method}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <span className="text-sm md:text-base font-black text-emerald-500 font-sans">৳{p.amount}</span>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5">
                            <span className="text-[10px] md:text-xs font-bold text-slate-500">{p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredPayments.length === 0 && (
                    <div className="py-24 text-center text-slate-400 font-bold">কোন পেমেন্ট হিস্ট্রি পাওয়া যায়নি</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-5 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
                  <div className="w-full sm:w-auto">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">শপ ম্যানেজমেন্ট</h2>
                    <p className="text-xs md:text-sm font-bold text-slate-500">টুলস ও গ্যাজেট পরিচালনা করুন</p>
                  </div>
                </div>
                <div className="overflow-x-auto scroller-custom">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">প্রোডাক্ট</th>
                        <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">মূল্য</th>
                        <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 md:px-8 py-6 md:py-8">
                            <div className="flex items-center gap-6 md:gap-8">
                              <div className="h-20 w-20 md:h-24 md:w-24 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                <img src={p.image} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <div className="font-black text-slate-900 text-base md:text-xl line-clamp-1 tracking-tight">{p.title}</div>
                                <div className="text-[10px] md:text-xs text-slate-400 font-bold mt-2 bg-slate-100 px-3 py-1 rounded-lg inline-block">{p.category}</div>
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2 max-w-md font-medium leading-relaxed">{p.desc || p.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-6 md:py-8 font-black font-sans text-lg md:text-2xl text-primary-600">৳{p.price}</td>
                          <td className="px-6 md:px-8 py-6 md:py-8 text-right">
                             <button onClick={() => deleteItem(p.id, 'products')} className="p-3 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all active:scale-95 border border-slate-200 hover:border-rose-500 shadow-sm">
                                <Trash2 className="w-6 h-6" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && <div className="py-20 text-center text-slate-400 font-bold">কোন প্রোডাক্ট পাওয়া যায়নি</div>}
                </div>
              </motion.div>
            )}

            {activeTab === 'ebooks' && (
              <motion.div
                key="ebooks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-5 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
                  <div className="w-full sm:w-auto">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">ই-বুক ম্যানেজমেন্ট</h2>
                    <p className="text-xs md:text-sm font-bold text-slate-500">ডিজিটাল বুকস ও রিসোর্স পরিচালনা করুন</p>
                  </div>
                </div>
                <div className="overflow-x-auto scroller-custom">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">বইয়ের নাম</th>
                        <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">মূল্য</th>
                        <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ebooks.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 md:px-8 py-6 md:py-8">
                            <div className="flex items-center gap-6 md:gap-8">
                              <div className="h-28 w-20 md:h-36 md:w-28 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-md transition-transform group-hover:scale-105">
                                <img src={b.image} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <div className="font-black text-slate-900 text-base md:text-xl line-clamp-2 leading-snug tracking-tight max-w-lg">{b.title}</div>
                                <div className="text-[10px] md:text-xs text-slate-400 font-bold mt-2 bg-slate-100 px-3 py-1 rounded-lg inline-block">{b.category}</div>
                                <p className="text-xs text-slate-500 mt-3 line-clamp-3 max-w-md font-medium leading-relaxed">{b.desc || b.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-6 md:py-8 font-black font-sans text-lg md:text-2xl text-primary-600">৳{b.price}</td>
                          <td className="px-6 md:px-8 py-6 md:py-8 text-right">
                             <button onClick={() => deleteItem(b.id, 'ebooks')} className="p-3 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all active:scale-95 border border-slate-200 hover:border-rose-500 shadow-sm">
                                <Trash2 className="w-6 h-6" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {ebooks.length === 0 && <div className="py-20 text-center text-slate-400 font-bold">কোন ই-বুক পাওয়া যায়নি</div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Manage Lessons Modal */}
      <AnimatePresence>
        {selectedCourseForLessons && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCourseForLessons(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-6xl h-[90vh] bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 md:p-10 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 line-clamp-1">{selectedCourseForLessons.title}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">লেসন ও মডিউল ম্যানেজমেন্ট</p>
                </div>
                <button onClick={() => setSelectedCourseForLessons(null)} className="p-3 hover:bg-slate-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Lesson List (Left) */}
                <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto border-r border-slate-100 bg-slate-50/30">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                       <ListOrdered className="w-5 h-5 text-primary-600" />
                       লেসন লিস্ট ({courseLessons.length})
                    </h4>
                    <button 
                      onClick={() => {
                        setEditingLessonId(null);
                        setLessonFormData({ title: '', moduleId: '', videoUrl: '', isFree: false, order: courseLessons.length + 1, description: '' });
                        setIsAddingLesson(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-black shadow-lg hover:shadow-primary-600/20 active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" /> নতুন ক্লাস দিন
                    </button>
                  </div>

                  <div className="space-y-3">
                    {courseLessons.map((l, idx) => (
                      <div key={l.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm group hover:border-primary-200 transition-all">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-black rounded uppercase border border-primary-100">
                                 {l.moduleId || 'General'}
                               </span>
                               <button 
                                 type="button"
                                 onClick={() => {
                                   setLessonFormData({...lessonFormData, moduleId: l.moduleId || ''});
                                   setIsAddingLesson(true);
                                 }}
                                 className="text-[10px] text-slate-400 font-bold hover:text-primary-600 transition-colors"
                               >
                                 + এই মডিউলে যোগ করুন
                               </button>
                               <span className="text-[10px] text-slate-400 font-bold">Order: {l.order}</span>
                            </div>
                            <h5 className="font-black text-slate-800 text-sm md:text-base leading-tight">{l.title}</h5>
                            <div className="flex items-center gap-2 mt-2">
                               <a href={l.videoUrl} target="_blank" rel="noreferrer" className="text-[10px] text-primary-600 font-bold hover:underline flex items-center gap-1">
                                 <Play className="w-3 h-3" /> ভিডিও লিংক
                               </a>
                               {l.isFree && <span className="text-[10px] text-emerald-500 font-black uppercase">Free Preview</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                              onClick={() => {
                                setEditingLessonId(l.id);
                                setLessonFormData({
                                  title: l.title,
                                  moduleId: l.moduleId || '',
                                  videoUrl: l.videoUrl,
                                  isFree: l.isFree || false,
                                  order: l.order,
                                  description: l.description || ''
                                });
                                setIsAddingLesson(true);
                              }}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl border border-transparent hover:border-primary-100"
                            >
                              <Filter className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteLesson(l.id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {courseLessons.length === 0 && (
                      <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                        কোন লেসন যুক্ত করা হয়নি। ডান পাশের ফর্ম থেকে যোগ করুন।
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Lesson Form (Right) */}
                <div className={`w-full md:w-1/2 p-6 md:p-10 overflow-y-auto bg-white ${isAddingLesson ? 'block' : 'hidden md:block'}`}>
                  <div className="mb-10 flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{editingLessonId ? 'লেসন এডিট করুন' : 'নতুন কন্টেন্ট যোগ করুন'}</h4>
                      <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">{editingLessonId ? 'বিদ্যমান কন্টেন্ট আপডেট করুন' : 'সাবজেক্ট বা অধ্যায় ভিত্তিক কন্টেন্ট দিন'}</p>
                    </div>
                    {editingLessonId && (
                      <button 
                        onClick={() => {
                          setEditingLessonId(null);
                          setLessonFormData({ title: '', moduleId: '', videoUrl: '', isFree: false, order: courseLessons.length + 1, description: '' });
                        }}
                        className="text-xs font-black text-rose-500 hover:underline"
                      >
                        বাতিল করুন
                      </button>
                    )}
                  </div>

                  <form onSubmit={saveLesson} className="space-y-6">
                    <div className="space-y-4">
                       <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">সাবজেক্ট / মডিউল নাম</label>
                       
                       {/* Module Suggestions */}
                       {Array.from(new Set(courseLessons.map(l => l.moduleId).filter(Boolean))).length > 0 && (
                         <div className="flex flex-wrap gap-2 mb-4">
                            {Array.from(new Set(courseLessons.map(l => l.moduleId))).map(mod => (
                              <button
                                key={mod}
                                type="button"
                                onClick={() => setLessonFormData({...lessonFormData, moduleId: mod || ''})}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                  lessonFormData.moduleId === mod 
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'
                                }`}
                              >
                                {mod || 'সাধারণ বিষয়'}
                              </button>
                            ))}
                         </div>
                       )}

                       <input 
                         type="text" 
                         required 
                         placeholder="নতুন মডিউলের নাম লিখুন অথবা উপরের তালিকা থেকে বাছুন" 
                         value={lessonFormData.moduleId} 
                         onChange={e => setLessonFormData({...lessonFormData, moduleId: e.target.value})} 
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all" 
                       />
                       <p className="text-[10px] text-slate-400 font-bold uppercase pl-1">* একই সাবজেক্টে একাধিক অধ্যায় দিতে একই মডিউল নাম ব্যবহার করুন</p>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">অধ্যায় / লেসন শিরোনাম</label>
                       <input 
                         type="text" 
                         required 
                         placeholder="উদাহরণ: অধ্যায় ১: ভৌত জগত ও পরিমাপ" 
                         value={lessonFormData.title} 
                         onChange={e => setLessonFormData({...lessonFormData, title: e.target.value})} 
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all" 
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">YouTube ভিডিও লিংক (লিঙ্ক)</label>
                       <input 
                         type="url" 
                         required 
                         placeholder="https://youtube.com/..." 
                         value={lessonFormData.videoUrl} 
                         onChange={e => setLessonFormData({...lessonFormData, videoUrl: e.target.value})} 
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all" 
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">সিরিয়াল নম্বর (Order)</label>
                         <input 
                           type="number" 
                           required 
                           value={lessonFormData.order} 
                           onChange={e => setLessonFormData({...lessonFormData, order: Number(e.target.value)})} 
                           className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all" 
                         />
                       </div>
                       <div className="flex items-center gap-3 pt-6">
                         <input 
                           type="checkbox" 
                           id="isFree"
                           checked={lessonFormData.isFree} 
                           onChange={e => setLessonFormData({...lessonFormData, isFree: e.target.checked})} 
                           className="w-6 h-6 rounded-lg text-primary-600 border-slate-300 focus:ring-primary-500" 
                         />
                         <label htmlFor="isFree" className="text-sm font-black text-slate-700 uppercase">ফ্রি প্রিভিউ?</label>
                       </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-primary-600 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                         {loading ? 'সংরক্ষণ করা হচ্ছে...' : (editingLessonId ? 'আপডেট করুন' : 'লেসন সেভ করুন')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-6xl h-[95vh] md:h-[90vh] bg-white rounded-[1.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col"
            >
               <div className="p-6 md:p-10 border-b border-slate-100 flex justify-between items-center bg-white relative z-20 shrink-0">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">নতুন {activeTab === 'courses' ? 'কোর্স' : activeTab === 'products' ? 'প্রোডাক্ট' : 'ই-বুক'} যোগ করুন</h3>
                    <p className="text-xs md:text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">তথ্যগুলো নির্ভুলভাবে প্রদান করুন</p>
                  </div>
                  <button onClick={() => setIsAdding(false)} className="p-3 md:p-4 hover:bg-slate-100 rounded-full transition-all group active:scale-90"><X className="w-6 h-6 md:w-8 md:h-8 text-slate-400 group-hover:text-slate-900" /></button>
               </div>
               
               <form onSubmit={addItem} className="p-6 md:p-14 space-y-8 md:space-y-12 overflow-y-auto scroller-custom bg-slate-50/10 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-3 col-span-1 md:col-span-2">
                       <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">শিরোনাম / নাম</label>
                       <input type="text" required placeholder="উদাহরণ: SSC পূর্ণাঙ্গ প্রস্তুতি ব্যাচ ২০২৪" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 md:py-5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all text-sm md:text-lg shadow-sm" />
                    </div>
                    
                    <div className="space-y-3">
                       <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">মূল্য (৳)</label>
                       <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">৳</span>
                          <input type="number" required placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full pl-12 pr-6 py-4 md:py-5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all text-sm md:text-lg shadow-sm" />
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                       <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">ক্যাটাগরি</label>
                       <input type="text" required placeholder="উদাহরণ: Science, Math, Book" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-6 py-4 md:py-5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all text-sm md:text-lg shadow-sm" />
                    </div>

                    <div className="space-y-3 col-span-1 md:col-span-2">
                       <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">থাম্বনেইল ইমেজ URL (লিঙ্ক)</label>
                       <input type="url" required placeholder="https://example.com/image.jpg" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="w-full px-6 py-4 md:py-5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all text-sm md:text-base shadow-sm" />
                    </div>

                    {activeTab === 'courses' && (
                       <div className="space-y-3 col-span-1 md:col-span-2">
                          <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">শিক্ষকের নাম</label>
                          <input type="text" required placeholder="উদাহরণ: কামরুল হাসান" value={formData.instructorName} onChange={e => setFormData({...formData, instructorName: e.target.value})} className="w-full px-6 py-4 md:py-5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all text-sm md:text-lg shadow-sm" />
                       </div>
                    )}

                    {activeTab === 'ebooks' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 md:col-span-2">
                          <div className="space-y-3">
                             <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">লেখকের নাম</label>
                             <input type="text" required placeholder="উদাহরণ: মুনজেরিন শহীদ" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full px-6 py-4 md:py-5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all text-sm md:text-base shadow-sm" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest pl-1">মোট পৃষ্ঠা</label>
                             <input type="number" required placeholder="উদাহরণ: ৩৫০" value={formData.pages} onChange={e => setFormData({...formData, pages: Number(e.target.value)})} className="w-full px-6 py-4 md:py-5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-primary-600 font-bold transition-all text-sm md:text-base shadow-sm" />
                          </div>
                       </div>
                    )}
                    
                    <div className="space-y-4 col-span-1 md:col-span-2">
                       <label className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-[0.2em] pl-1">বিস্তারিত বিবরণ (Details)</label>
                       <textarea 
                          rows={20} 
                          required 
                          value={formData.description} 
                          onChange={e => setFormData({...formData, description: e.target.value})} 
                          className="w-full p-8 md:p-12 bg-white border-2 border-slate-200 rounded-2xl md:rounded-[3.5rem] focus:outline-none focus:border-primary-600 font-medium transition-all resize-y min-h-[500px] text-base md:text-xl leading-relaxed text-slate-700 shadow-inner" 
                          placeholder="পণ্যের বিস্তারিত বিবরণ এখানে লিখুন। বুলেট পয়েন্ট এবং প্যারাগ্রাফ ব্যবহার করতে পারেন..."
                       ></textarea>
                       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50 p-4 rounded-2xl">
                          <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">পরামর্শ: এই ঘরটি বড় করে দেখতে নিচের ডান কোণায় টেনে নামান (Resizble Box)</p>
                          <div className="flex items-center gap-3">
                             <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-primary-600"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, (formData.description.length / 1000) * 100)}%` }}
                                ></motion.div>
                             </div>
                             <p className="text-[10px] md:text-[12px] text-slate-900 font-black bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">{formData.description.length} টি অক্ষর</p>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="pt-10 pb-12">
                    <button type="submit" className="w-full py-6 md:py-10 bg-primary-600 text-white rounded-[2rem] md:rounded-[4rem] font-black text-xl md:text-3xl hover:bg-primary-700 hover:shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] shadow-2xl relative overflow-hidden group">
                       <span className="relative z-10 flex items-center justify-center gap-4">
                          <span>তথ্য সংরক্ষণ করুন</span>
                          <Check className="w-6 h-6 md:w-10 md:h-10" />
                       </span>
                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: 'primary' | 'emerald' | 'blue' | 'rose' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600 border-primary-100/50 hover:border-primary-300',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50 hover:border-emerald-300',
    blue: 'bg-blue-50 text-blue-600 border-blue-100/50 hover:border-blue-300',
    rose: 'bg-rose-50 text-rose-600 border-rose-100/50 hover:border-rose-300'
  };

  return (
    <div className={`p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border shadow-sm transition-all relative overflow-hidden group bg-white ${colors[color]}`}>
      <div className={`absolute -right-4 -top-4 w-32 h-32 bg-white/40 rounded-full blur-[40px] pointer-events-none group-hover:scale-125 transition-transform`}></div>
      <div className="flex items-center gap-4 md:gap-6 relative z-10">
        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border border-current/10 shadow-sm transition-transform group-hover:rotate-12`}>
          <Icon className="h-5 w-5 md:h-7 md:w-7" />
        </div>
        <div>
          <div className="text-xl md:text-3xl font-black font-sans tracking-tight mb-0.5 md:mb-1">{value}</div>
          <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60">{label}</div>
        </div>
      </div>
    </div>
  );
}

