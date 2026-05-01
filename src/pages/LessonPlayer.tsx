import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle2, ChevronLeft, Menu, X, FileText, HelpCircle, MessageSquare, Video, Loader2, ChevronDown, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Course, Lesson } from '../types';
import Logo from '../components/Logo';

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!courseId || !lessonId) return;

    // Fetch Lesson Data from Subcollection
    const unsubscribeLesson = onSnapshot(doc(db, 'courses', courseId, 'lessons', lessonId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const lessonData = { id: docSnapshot.id, ...docSnapshot.data() } as Lesson;
        setLesson(lessonData);
        
        // Fetch Course Content
        const unsubscribeCourse = onSnapshot(doc(db, 'courses', courseId), (courseSnap) => {
          if (courseSnap.exists()) {
            setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
          }
        });

        const lessonsQuery = query(collection(db, 'courses', courseId, 'lessons'), orderBy('order', 'asc'));
        const unsubscribeAllLessons = onSnapshot(lessonsQuery, (snapshot) => {
          const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));
          setAllLessons(data);
          
          // Auto open current lesson's module
          if (lessonData.moduleId) {
            setOpenModules(prev => ({ ...prev, [lessonData.moduleId]: true }));
          } else {
            setOpenModules(prev => ({ ...prev, 'সাধারণ বিষয়': true }));
          }
        });

        return () => {
          unsubscribeCourse();
          unsubscribeAllLessons();
        };
      } else {
        setLoading(false);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `courses/${courseId}/lessons/${lessonId}`);
      setLoading(false);
    });

    return () => unsubscribeLesson();
  }, [courseId, lessonId]);

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
                
                <div className="overflow-y-auto flex-1 scroller-custom">
                   {Object.entries(
                     allLessons.reduce((acc, l) => {
                       const mod = l.moduleId || 'সাধারণ বিষয়';
                       if (!acc[mod]) acc[mod] = [];
                       acc[mod].push(l);
                       return acc;
                     }, {} as Record<string, Lesson[]>)
                   ).map(([modName, modLessons]) => (
                     <div key={modName} className="border-b border-slate-100">
                        <button 
                          onClick={() => setOpenModules(prev => ({ ...prev, [modName]: !prev[modName] }))}
                          className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left"
                        >
                           <span className="text-sm font-black text-slate-800 line-clamp-1 flex-1 pr-2">{modName}</span>
                           <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${openModules[modName] ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {openModules[modName] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-white"
                            >
                                {modLessons.map((l) => (
                                  <Link 
                                    to={`/play/${courseId}/${l.id}`}
                                    key={l.id} 
                                    className={`p-4 pl-6 flex gap-3 hover:bg-slate-50 border-l-4 transition-all group ${
                                      l.id === lessonId ? 'bg-primary-50 border-primary-600' : 'border-transparent'
                                    }`}
                                  >
                                     <div className="mt-0.5 shrink-0">
                                        {l.id === lessonId ? (
                                            <PlayCircle className="w-4 h-4 text-primary-600" />
                                        ) : (
                                            <PlayCircle className="w-4 h-4 text-slate-300 group-hover:text-primary-600" />
                                        )}
                                     </div>
                                     <div>
                                        <h4 className={`text-[13px] font-bold leading-snug mb-1 transition-colors ${
                                           l.id === lessonId ? 'text-primary-600' : 'text-slate-600 group-hover:text-slate-900'
                                        }`}>
                                           {l.title}
                                        </h4>
                                        <div className="flex items-center text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider">
                                           <Clock className="w-3 h-3 mr-1" /> {l.duration || '0:00'}
                                        </div>
                                     </div>
                                  </Link>
                               ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                   ))}
                   
                   {allLessons.length === 0 && (
                     <div className="p-10 text-center text-slate-400 text-sm font-bold italic">লেসন পাওয়া যায়নি</div>
                   )}
                </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}
