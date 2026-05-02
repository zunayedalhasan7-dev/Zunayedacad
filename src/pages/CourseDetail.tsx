import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, onSnapshot, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Course, Lesson, Enrollment } from '../types';
import { PlayCircle, Clock, BookOpen, User, CheckCircle, ChevronRight, ChevronDown, Lock, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Course Listener
    const unsubscribeCourse = onSnapshot(doc(db, 'courses', id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setCourse({ id: docSnapshot.id, ...docSnapshot.data() } as Course);
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `courses/${id}`);
      setLoading(false);
    });

    // Lessons Listener
    const lessonsQuery = query(collection(db, 'courses', id, 'lessons'));
    const unsubscribeLessons = onSnapshot(lessonsQuery, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson)).sort((a, b) => a.order - b.order);
      setLessons(lessonsData);
      
      // Initially open the first module
      if (lessonsData.length > 0) {
        const firstModule = lessonsData[0].moduleId || 'সাধারণ বিষয়';
        setOpenModules({ [firstModule]: true });
      }
    });

    // Enrollment Check (One-time check is usually enough, but let's make it real-time too)
    let unsubscribeEnrollment: (() => void) | undefined;
    if (user) {
      const enrollQuery = query(collection(db, 'enrollments'), 
        where('userId', '==', user.uid), 
        where('courseId', '==', id)
      );
      unsubscribeEnrollment = onSnapshot(enrollQuery, (snapshot) => {
        setIsEnrolled(!snapshot.empty);
      });
    }

    return () => {
      unsubscribeCourse();
      unsubscribeLessons();
      if (unsubscribeEnrollment) unsubscribeEnrollment();
    };
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
      // Redirect to dashboard after short delay or instantly
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'enrollments');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-96 bg-white rounded-3xl mb-12 border border-slate-200"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-white rounded w-1/2"></div>
            <div className="h-32 bg-white rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!course) return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="mb-8"
        >
          <img 
            src="https://img.freepik.com/free-vector/3d-cartoon-student-character-carrying-books_107791-16480.jpg" 
            alt="Not Found"
            className="w-64 h-64 object-contain mx-auto opacity-50 filter grayscale"
          />
        </motion.div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">কোর্সটি পাওয়া যায়নি</h1>
        <Link to="/courses" className="text-slate-900 mt-4 inline-block font-bold bg-slate-50 hover:bg-slate-100 px-8 py-4 rounded-xl transition-colors border border-slate-200">সকল কোর্স দেখুন</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24 relative overflow-hidden">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-primary-50 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-primary-50 blur-[150px] rounded-full"></div>
      </div>

      {/* Header / Hero */}
      <div className="pt-24 pb-16 relative z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider">
                <span className="text-primary-600 bg-primary-50 px-3 py-1 rounded-md border border-primary-100 shadow-sm">{course.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span className="text-slate-500 font-sans">{course.subject}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold font-bengali leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-200 to-slate-400">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-inner"><User className="mr-2 h-4 w-4 text-primary-600" /> ১০ বছর অভিজ্ঞ টিউটর</div>
                <div className="flex items-center bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-inner"><BookOpen className="mr-2 h-4 w-4 text-emerald-400" /> {lessons.length} টি লাইভ ক্লাস</div>
                <div className="flex items-center bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-inner"><Clock className="mr-2 h-4 w-4 text-amber-400" /> ২০ ঘণ্টার ভিডিও কনটেন্ট</div>
              </div>
            </div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white  rounded-3xl p-4 shadow-sm border border-slate-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-indigo-600/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative z-10 shadow-inner group-hover:shadow-sm transition-shadow">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <PlayCircle className="h-16 w-16 text-slate-900 drop-shadow-sm transition-transform group-hover:scale-110" />
                </div>
              </div>
              <div className="px-2 space-y-6 relative z-10">
                <div className="flex items-end gap-3 font-sans">
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-primary-600">
                    {course.discountPrice ? (course.discountPrice === 0 ? 'Free' : `৳${course.discountPrice}`) : (course.price === 0 ? 'Free' : `৳${course.price}`)}
                  </span>
                  {course.discountPrice && course.price > 0 && (
                    <span className="text-lg text-slate-500 line-through mb-1">৳{course.price}</span>
                  )}
                </div>
                
                {isEnrolled ? (
                  <Link to="/dashboard" className="w-full block text-center bg-primary-600 text-white font-bold py-4 rounded-xl hover:shadow-sm transition-all relative overflow-hidden group/btn text-lg">
                    <span className="relative z-10">ড্যাশবোর্ড থেকে ক্লাস করুন</span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out"></div>
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:shadow-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden group/btn text-lg disabled:opacity-70"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                       {enrolling ? 'প্রসেসিং হচ্ছে...' : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          <span>{course.price === 0 || course.discountPrice === 0 ? 'ফ্রি এনরোল করুন' : 'কোর্সটি কিনুন'}</span>
                        </>
                      )}
                    </span>
                  </button>
                )}
                
                <div className="space-y-4 text-sm font-medium text-slate-600">
                  {['আজীবন মেম্বারশিপ', 'মোবাইল এবং ল্যাপটপ থেকে এক্সেস', 'কোর্স শেষে সার্টিফিকেট'].map((feature, i) => (
                    <p key={i} className="flex items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-400 drop-shadow-sm shrink-0" /> 
                      {feature}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <section className="bg-white  rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-200 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary-600 to-transparent opacity-50"></div>
              <h2 className="text-2xl font-bold font-bengali text-slate-900 mb-6">কোর্স সম্পর্কে বিস্তারিত</h2>
              <div className={`prose prose-invert max-w-none text-slate-600 space-y-4 whitespace-pre-wrap leading-relaxed text-lg relative ${!isDescriptionExpanded ? 'line-clamp-5' : ''}`}>
                {course.description}
                {course.description && course.description.length > 250 && !isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
              {course.description && course.description.length > 250 && (
                <button 
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-4 text-primary-600 font-bold hover:text-primary-700 transition-colors text-sm flex items-center gap-1 font-bengali"
                >
                  {isDescriptionExpanded ? 'কম দেখুন' : 'আরও দেখুন'}
                </button>
              )}
            </section>

            {/* Curriculum */}
            <section className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-200 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary-600 to-transparent opacity-50"></div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold font-bengali text-slate-900">কোর্স কারিকুলাম</h2>
                <span className="text-sm bg-primary-50 text-primary-600 border border-primary-100 px-4 py-1.5 rounded-full font-bold shadow-sm">{lessons.length} টি লেসন</span>
              </div>
              
              <div className="space-y-4">
                {Object.entries(
                  lessons.reduce((acc, lesson) => {
                    const module = lesson.moduleId || 'সাধারণ বিষয়';
                    if (!acc[module]) acc[module] = [];
                    acc[module].push(lesson);
                    return acc;
                  }, {} as Record<string, Lesson[]>)
                ).map(([moduleName, moduleLessons]) => (
                  <div key={moduleName} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <button 
                      onClick={() => setOpenModules(prev => ({ ...prev, [moduleName]: !prev[moduleName] }))}
                      className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                          <BookOpen className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-lg">{moduleName}</h3>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{moduleLessons.length} টি লেসন</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openModules[moduleName] ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {openModules[moduleName] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="p-4 space-y-2 bg-white">
                            {moduleLessons.map((lesson) => (
                              <div 
                                key={lesson.id}
                                onClick={() => {
                                  if (isEnrolled || lesson.isFree) {
                                    navigate(`/play/${id}/${lesson.id}`);
                                  }
                                }}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${
                                  isEnrolled || lesson.isFree 
                                    ? 'border-slate-100 bg-white hover:border-primary-200 hover:shadow-md cursor-pointer' 
                                    : 'border-slate-50 bg-slate-50/50 opacity-70 grayscale cursor-not-allowed'
                                }`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                    isEnrolled || lesson.isFree ? 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white' : 'bg-slate-100 text-slate-400'
                                  }`}>
                                    {isEnrolled || lesson.isFree ? <PlayCircle className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-700 leading-tight group-hover:text-slate-900 transition-colors">{lesson.title}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                      {lesson.duration && <span className="text-[10px] text-slate-400 font-sans flex items-center"><Clock className="w-3 h-3 mr-1" /> {lesson.duration}</span>}
                                      {lesson.isFree && !isEnrolled && (
                                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tighter shadow-sm">Free</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {(isEnrolled || lesson.isFree) && <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all" />}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                
                {lessons.length === 0 && (
                   <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                     <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                     <p className="font-bold">এই কোর্সে এখনো কোনো কন্টেন্ট যুক্ত করা হয়নি।</p>
                   </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar / Instructor Info */}
          <div className="space-y-8">
            <section className="bg-white  rounded-3xl p-8 shadow-sm border border-slate-200 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 blur-[50px] rounded-full pointer-events-none"></div>
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary-600/20 to-indigo-600/20 p-1 mx-auto mb-6 shadow-sm relative z-10">
                 <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zunayed" 
                      alt="Instructor" 
                      className="w-full h-full object-cover bg-slate-800"
                    />
                 </div>
              </div>
              <h3 className="text-xl font-bold font-bengali text-slate-900">জুনায়েদ আহমেদ</h3>
              <p className="text-sm text-primary-600 mb-6 font-medium mt-1 inline-block bg-primary-50 px-3 py-1 rounded-full border border-primary-100">ফাউন্ডার, জুনায়েদ একাডেমি</p>
              <div className="text-sm text-slate-500 mb-8 leading-relaxed">
                জুনায়েদ আহমেদ গত ৫ বছর ধরে এসএসসি ও এইচএসসি পর্যায়ের শিক্ষার্থীদের পড়িয়ে আসছেন। তার সহজ ভাবে উপস্থাপনা হাজারো শিক্ষার্থীর প্রিয়।
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500 uppercase">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner">
                  <div className="text-slate-900 text-2xl mb-1 font-sans font-bold">১২০০+</div>
                  সফল ছাত্র
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner">
                  <div className="text-slate-900 text-2xl mb-1 font-sans font-bold">১৫টি</div>
                  কোর্স
                </div>
              </div>
            </section>

            <section className="bg-primary-50 rounded-3xl p-8 text-slate-900 shadow-sm border border-primary-100 relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-50 blur-[50px] rounded-full pointer-events-none"></div>
              <h3 className="text-lg font-bold font-bengali mb-4 relative z-10">কোন সাহায্য প্রয়োজন?</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed relative z-10">
                আমাদের কোর্স নিয়ে কোন প্রশ্ন থাকলে অথবা ভর্তি হতে কোন সমস্যা হলে আমাদের কল করুন।
              </p>
              <div className="space-y-4 font-bold relative z-10">
                <a href="tel:+8801626538051" className="flex items-center gap-4 group bg-slate-50 p-3 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors">
                  <span className="bg-primary-50 p-3 rounded-xl border border-primary-100 group-hover:bg-primary-50 transition-colors shadow-sm">
                    <Clock className="h-5 w-5 text-slate-900" />
                  </span>
                  <span className="text-slate-900 text-lg tracking-wider font-sans group-hover:text-primary-600 transition-colors">+880 1626-538051</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
