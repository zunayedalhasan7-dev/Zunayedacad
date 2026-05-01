import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle2, ChevronLeft, Menu, X, FileText, HelpCircle, MessageSquare, Video, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Course, Lesson } from '../types';
import Logo from '../components/Logo';

export default function LessonPlayer() {
  const { id } = useParams(); // Lesson ID
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!id) return;

    // Fetch Lesson Data
    const unsubscribeLesson = onSnapshot(doc(db, 'lessons', id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const lessonData = { id: docSnapshot.id, ...docSnapshot.data() } as Lesson;
        setLesson(lessonData);
        
        // Once we have lesson, fetch course and other lessons
        if (lessonData.courseId) {
          const unsubscribeCourse = onSnapshot(doc(db, 'courses', lessonData.courseId), (courseSnap) => {
            if (courseSnap.exists()) {
              setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
            }
          });

          const lessonsQuery = query(collection(db, 'lessons'), where('courseId', '==', lessonData.courseId));
          const unsubscribeAllLessons = onSnapshot(lessonsQuery, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lesson)).sort((a, b) => a.order - b.order);
            setAllLessons(data);
          });

          return () => {
            unsubscribeCourse();
            unsubscribeAllLessons();
          };
        }
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `lessons/${id}`);
      setLoading(false);
    });

    return () => unsubscribeLesson();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">লেসন পাওয়া যায়নি</h2>
        <Link to="/dashboard" className="text-primary-600 font-medium">ড্যাশবোর্ডে ফিরে যান</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Top Navbar */}
      <nav className="bg-white text-slate-900 h-20 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0 border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-slate-500 hover:text-primary-600 transition-colors bg-slate-50 p-2 rounded-lg hover:bg-slate-100">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="hidden sm:flex border-l border-slate-200 pl-4 items-center gap-3">
             <Logo className="scale-75 origin-left" iconOnly />
             <h1 className="font-bold text-sm lg:text-base line-clamp-1 text-slate-800">
               {course?.title || 'Loading...'}
             </h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
           {/* Progress (Placeholder for now) */}
           <div className="hidden md:flex items-center gap-3">
              <div className="text-xs font-medium text-slate-500">প্রগ্রেস: <span className="text-primary-600 font-sans font-bold">০%</span></div>
              <div className="w-32 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                 <div className="h-full bg-primary-600 w-[0%] rounded-full shadow-sm" />
              </div>
           </div>
           <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="p-2 text-slate-500 hover:text-primary-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
           >
             {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative z-10">
         {/* Main Content Area */}
         <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Video Player Area */}
            <div className="w-full bg-black aspect-video relative group shadow-sm border-b border-slate-200">
               {lesson.videoUrl ? (
                 <iframe
                   src={`https://www.youtube.com/embed/${lesson.videoUrl.split('v=')[1] || lesson.videoUrl.split('/').pop()}`}
                   className="w-full h-full"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                   title={lesson.title}
                 ></iframe>
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <p className="text-white opacity-50">ভিডিও পাওয়া যায়নি</p>
                 </div>
               )}
            </div>

            {/* Video Info & Tabs */}
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
               <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">{lesson.title}</h1>
               
               <div className="flex gap-6 border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar">
                  {[
                    { id: 'overview', label: 'ওভারভিউ', icon: <FileText className="w-4 h-4 mr-2" /> },
                    { id: 'qa', label: 'প্রশ্ন ও উত্তর', icon: <HelpCircle className="w-4 h-4 mr-2" /> },
                    { id: 'notes', label: 'নোটস', icon: <MessageSquare className="w-4 h-4 mr-2" /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center pb-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors relative ${
                        activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-primary-600'
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
               </div>

               <div className="max-w-none text-slate-600">
                  {activeTab === 'overview' && (
                     <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 space-y-4">
                        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: lesson.description || '' }}></div>
                        {!lesson.description && <p className="text-slate-500">এই লেসনের কোনো ডেসক্রিপশন নেই।</p>}
                     </div>
                  )}
                  {activeTab === 'qa' && (
                     <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
                        <HelpCircle className="w-12 h-12 text-slate-400 mb-4" />
                        <p className="text-lg text-slate-500">এই লেসন সম্পর্কে আপনার কোনো প্রশ্ন থাকলে এখানে জিজ্ঞেস করতে পারেন।</p>
                        <button className="mt-6 px-6 py-3 bg-slate-50 text-slate-900 rounded-xl font-medium border border-slate-200 hover:border-primary-100 transition-colors">
                           নতুন প্রশ্ন করুন
                        </button>
                     </div>
                  )}
                  {activeTab === 'notes' && (
                     <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
                        <FileText className="w-12 h-12 text-slate-400 mb-4" />
                        <p className="text-lg text-slate-500">আপনার নিজস্ব নোটগুলো এখানে সেভ থাকবে।</p>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Course Curriculum Sidebar */}
         <AnimatePresence>
           {sidebarOpen && (
             <motion.div 
               initial={{ x: 320 }}
               animate={{ x: 0 }}
               exit={{ x: 320 }}
               className="fixed lg:static inset-y-0 right-0 w-80 bg-white border-l border-slate-200 z-20 transition-all flex flex-col pt-20 lg:pt-0 shadow-xl lg:shadow-none"
             >
                <div className="p-5 border-b border-slate-200 shrink-0 bg-slate-50">
                   <h2 className="font-bold text-slate-900 flex items-center gap-2">
                     <Video className="w-5 h-5 text-primary-600" />
                     কোর্সের কন্টেন্ট
                   </h2>
                </div>
                
                <div className="overflow-y-auto flex-1">
                   {allLessons.map((l) => (
                      <Link 
                        to={`/play/${l.id}`}
                        key={l.id} 
                        className={`p-4 flex gap-3 hover:bg-slate-50 border-l-4 transition-all group ${
                          l.id === id ? 'bg-primary-50 border-primary-600' : 'border-transparent'
                        }`}
                      >
                         <div className="mt-0.5 shrink-0">
                            {l.id === id ? (
                                <PlayCircle className="w-5 h-5 text-primary-600" />
                            ) : (
                                <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-primary-600" />
                            )}
                         </div>
                         <div>
                            <h4 className={`text-sm font-medium leading-snug mb-1 transition-colors ${
                               l.id === id ? 'text-primary-600' : 'text-slate-700 group-hover:text-primary-600'
                            }`}>
                               {l.title}
                            </h4>
                            <div className="flex items-center text-xs text-slate-500 font-sans">
                               <Video className="w-3 h-3 mr-1" /> {l.duration || '0:00'}
                            </div>
                         </div>
                      </Link>
                   ))}
                   {allLessons.length === 0 && (
                     <div className="p-8 text-center text-slate-500 text-sm italic">লেসন পাওয়া যায়নি</div>
                   )}
                </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}
