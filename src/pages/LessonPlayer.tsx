import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle2, ChevronLeft, Menu, X, FileText, HelpCircle, MessageSquare, Video, Loader2, ChevronDown, Clock, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Course, Lesson, Comment, Enrollment } from '../types';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

function CommentItem({ comment, courseId, lessonId }: { comment: Comment, courseId: string, lessonId: string }) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [activeReply, setActiveReply] = useState(false);
  const [newReply, setNewReply] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'courses', courseId, 'lessons', lessonId, 'comments', comment.id, 'replies'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snap => {
       setReplies(snap.docs.map(d => ({id: d.id, ...d.data()}) as Comment));
    });
    return () => unsub();
  }, [courseId, lessonId, comment.id]);

  const handlePostReply = async () => {
    if (!newReply.trim() || !user || !courseId || !lessonId) return;
    try {
      await addDoc(collection(db, 'courses', courseId, 'lessons', lessonId, 'comments', comment.id, 'replies'), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        text: newReply,
        createdAt: serverTimestamp()
      });
      setNewReply('');
      setActiveReply(false);
    } catch(err) {
       console.error(err);
    }
  };

  return (
     <div className="flex gap-3">
        <img src={comment.userPhoto || 'https://ui-avatars.com/api/?name=' + comment.userName} alt={comment.userName} className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
           <div className="bg-slate-50 p-4 rounded-2xl">
               <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 line-clamp-1">{comment.userName}</span>
                  <span className="text-xs text-slate-400 shrink-0 ml-2">{comment.createdAt?.toDate().toLocaleDateString('bn-BD')}</span>
               </div>
               <p className="text-slate-700">{comment.text}</p>
               
               {user && (
                 <button 
                   onClick={() => setActiveReply(!activeReply)}
                   className="text-[11px] font-bold text-slate-500 mt-2 hover:text-primary-600 transition-colors"
                 >
                   {activeReply ? 'বাতিল করুন' : 'রিপ্লাই দিন'}
                 </button>
               )}
           </div>

           {activeReply && (
             <div className="mt-3 flex gap-2 items-start pl-2">
                <img src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + user?.displayName} className="w-6 h-6 rounded-full shrink-0 mt-1" />
                <div className="flex-1">
                  <textarea
                     value={newReply}
                     onChange={(e) => setNewReply(e.target.value)}
                     placeholder="রিপ্লাই লিখুন..."
                     className="w-full p-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-300"
                     rows={1}
                  />
                  <div className="flex justify-end mt-1">
                     <button 
                       onClick={handlePostReply}
                       disabled={!newReply.trim()}
                       className="px-3 py-1 bg-primary-600 text-white rounded-lg font-bold text-[11px] disabled:opacity-50"
                     >
                       পোস্ট
                     </button>
                  </div>
                </div>
             </div>
           )}

           {replies.length > 0 && (
             <div className="mt-3 space-y-3 pl-4 border-l-2 border-slate-100">
               {replies.map(reply => (
                 <div key={reply.id} className="flex gap-2">
                    <img src={reply.userPhoto || 'https://ui-avatars.com/api/?name=' + reply.userName} className="w-6 h-6 rounded-full shrink-0" />
                    <div className="flex-1 min-w-0">
                       <span className="font-bold text-[11px] text-slate-900 mr-2">{reply.userName}</span>
                       <span className="text-[10px] text-slate-400">{reply.createdAt?.toDate().toLocaleDateString('bn-BD')}</span>
                       <p className="text-slate-700 text-sm mt-0.5">{reply.text}</p>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
     </div>
  );
}

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    console.log("LessonPlayer useEffect triggered", { courseId, lessonId });
    if (!courseId || !lessonId) {
      console.log("Missing courseId or lessonId");
      return;
    }

    // Fetch Lesson Data from Subcollection
    const unsubscribeLesson = onSnapshot(doc(db, 'courses', courseId, 'lessons', lessonId), (docSnapshot) => {
      console.log("Lesson snapshot triggered", docSnapshot.exists());
      if (docSnapshot.exists()) {
        const lessonData = { id: docSnapshot.id, ...docSnapshot.data() } as Lesson;
        setLesson(lessonData);
        setLoading(false);
        
        // Fetch Course Content
        const unsubscribeCourse = onSnapshot(doc(db, 'courses', courseId), (courseSnap) => {
          if (courseSnap.exists()) {
            setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
          }
        });

        const lessonsQuery = query(collection(db, 'courses', courseId, 'lessons'), orderBy('order', 'asc'));
        const unsubscribeAllLessons = onSnapshot(lessonsQuery, (snapshot) => {
          console.log("Lessons snapshot triggered", snapshot.size);
          const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));
          setAllLessons(data);
          
          // Auto open current lesson's module
          if (lessonData.moduleId) {
            setOpenModules(prev => ({ ...prev, [lessonData.moduleId]: true }));
          } else {
            setOpenModules(prev => ({ ...prev, 'সাধারণ বিষয়': true }));
          }
        });

        // Fetch comments
        const commentsQuery = query(collection(db, 'courses', courseId, 'lessons', lessonId, 'comments'), orderBy('createdAt', 'desc'));
        const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
          setComments(snapshot.docs.map(d => ({id: d.id, ...d.data()}) as Comment));
        });

        // Fetch Enrollment
        let unsubscribeEnrollment = () => {};
        if (user) {
          const enrollQuery = query(collection(db, 'enrollments'), where('userId', '==', user.uid), where('courseId', '==', courseId));
          unsubscribeEnrollment = onSnapshot(enrollQuery, (snapshot) => {
            if (!snapshot.empty) {
              const enrollDoc = snapshot.docs[0];
              const enrollData = { id: enrollDoc.id, ...enrollDoc.data() } as Enrollment;
              setEnrollment(enrollData);
              setCompletedLessons(enrollData.completedLessons || []);
              
              // Update last accessed time
              updateDoc(doc(db, 'enrollments', enrollDoc.id), { lastAccessedAt: serverTimestamp() });
            }
          });
        }

        return () => {
          unsubscribeCourse();
          unsubscribeAllLessons();
          unsubscribeComments();
          unsubscribeEnrollment();
        };
      } else {
        console.log("Lesson document does not exist");
        setLoading(false);
      }
    }, (err) => {
      console.error("Firestore error in LessonPlayer", err);
      handleFirestoreError(err, OperationType.GET, `courses/${courseId}/lessons/${lessonId}`);
      setLoading(false);
    });

    return () => unsubscribeLesson();
  }, [courseId, lessonId]);

  const toggleLessonCompletion = async (e: React.MouseEvent, lessonId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!enrollment) return;
    const isCompleted = completedLessons.includes(lessonId);
    let newCompletedList: string[];
    if (isCompleted) {
        newCompletedList = completedLessons.filter(id => id !== lessonId);
    } else {
        newCompletedList = [...completedLessons, lessonId];
    }
    
    // Update Firestore
    const enrollRef = doc(db, 'enrollments', enrollment.id);
    const newProgress = allLessons.length > 0 ? Math.round((newCompletedList.length / allLessons.length) * 100) : 0;
    await updateDoc(enrollRef, {
        completedLessons: newCompletedList,
        progress: newProgress
    });
  }

  const handlePostComment = async () => {
    if (!newComment.trim() || !user || !courseId || !lessonId) return;
    try {
      await addDoc(collection(db, 'courses', courseId, 'lessons', lessonId, 'comments'), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        text: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch(err) {
       console.error(err);
    }
  };

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
             <h1 className="font-semibold text-[10px] md:text-xs line-clamp-1 text-slate-800">
               {course?.title || 'Loading...'}
             </h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
           {/* Progress */}
           {enrollment && (
             <div className="hidden md:flex items-center gap-3">
                <div className="text-xs font-medium text-slate-500">প্রগ্রেস: <span className="text-primary-600 font-sans font-bold">{enrollment.progress}%</span></div>
                <div className="w-32 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                   <div className="h-full bg-primary-600 rounded-full shadow-sm transition-all duration-300" style={{ width: `${enrollment.progress}%` }} />
                </div>
             </div>
           )}
           <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="p-2 text-slate-500 hover:text-primary-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
           >
             {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative z-10 w-full lg:flex-row flex-col">
         {/* Main Content Area */}
         <div className="flex-1 flex flex-col overflow-y-auto w-full lg:w-2/3">
            {/* Video Player Area */}
            <div className="w-full bg-black aspect-video relative group shadow-sm">
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
            <div className="w-full px-4 sm:px-6 py-8">
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
                        <div className="prose prose-slate max-w-none">
                          <div className={`overflow-hidden transition-all duration-300 ${isDescriptionExpanded ? 'max-h-none' : 'max-h-20'}`} dangerouslySetInnerHTML={{ __html: lesson.description || '' }}></div>
                          {lesson.description && lesson.description.length > 200 && (
                            <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-primary-600 font-bold mt-2 text-sm">
                              {isDescriptionExpanded ? 'কম দেখুন' : 'আরও দেখুন'}
                            </button>
                          )}
                        </div>
                        {!lesson.description && <p className="text-slate-500">এই লেসনের কোনো ডেসক্রিপশন নেই।</p>}
                     </div>
                  )}
                  {activeTab === 'qa' && (
                     <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        {user ? (
                          <div className="mb-6 flex gap-3">
                             <img src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName} alt={user.displayName} className="w-10 h-10 rounded-full" />
                             <div className="flex-1">
                               <textarea
                                 value={newComment}
                                 onChange={(e) => setNewComment(e.target.value)}
                                 placeholder="আপনার প্রশ্ন এখানে লিখুন..."
                                 className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                 rows={3}
                               />
                               <button 
                                 onClick={handlePostComment}
                                 disabled={!newComment.trim()}
                                 className="mt-2 px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                               >
                                 <Send className="w-4 h-4" />
                                 প্রশ্ন করুন
                               </button>
                             </div>
                          </div>
                        ) : (
                          <div className="text-center p-6 bg-slate-50 rounded-xl mb-6">
                            <p className="text-slate-600 mb-4">প্রশ্ন করতে লগইন করুন।</p>
                            <Link to="/login" className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold">লগইন করুন</Link>
                          </div>
                        )}
                        
                        <div className="space-y-6">
                           {comments.length === 0 && <p className="text-center text-slate-400">কোনো প্রশ্ন নেই। প্রথম প্রশ্নটি আপনিই করুন!</p>}
                           {comments.map(comment => (
                             <CommentItem key={comment.id} comment={comment} courseId={courseId} lessonId={lessonId} />
                           ))}
                        </div>
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
         <div className="w-full lg:w-1/3 bg-white border-l border-slate-200 flex flex-col shadow-xl lg:shadow-none h-full overflow-y-auto">
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
                                to={(!l.isFree && !enrollment) ? '#' : `/play/${courseId}/${l.id}`}
                                key={l.id} 
                                onClick={(e) => {
                                  if (!l.isFree && !enrollment) e.preventDefault();
                                }}
                                className={`p-4 pl-6 flex gap-3 hover:bg-slate-50 border-l-4 transition-all group ${
                                  l.id === lessonId ? 'bg-primary-50 border-primary-600' : 'border-transparent'
                                } ${!l.isFree && !enrollment ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                 <div className="mt-0.5 shrink-0">
                                    {l.id === lessonId ? (
                                        <PlayCircle className="w-4 h-4 text-primary-600" />
                                    ) : (
                                        <PlayCircle className="w-4 h-4 text-slate-300 group-hover:text-primary-600" />
                                    )}
                                 </div>
                                 <div className="flex-1">
                                    <h4 className={`text-[13px] font-bold leading-snug mb-1 transition-colors line-clamp-1 ${
                                       l.id === lessonId ? 'text-primary-600' : 'text-slate-600 group-hover:text-slate-900'
                                    }`}>
                                       {l.title}
                                    </h4>
                                    <div className="flex items-center text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider">
                                       <Clock className="w-3 h-3 mr-1" /> {l.duration || '0:00'}
                                    </div>
                                 </div>
                                 {enrollment && (
                                     <button 
                                       onClick={(e) => toggleLessonCompletion(e, l.id)}
                                       className="ml-2 shrink-0"
                                     >
                                         <CheckCircle2 className={`w-5 h-5 ${completedLessons.includes(l.id) ? 'text-primary-600' : 'text-slate-200'}`} />
                                     </button>
                                 )}
                                 {!enrollment && !l.isFree && (
                                     <div className="ml-2 shrink-0 text-slate-400"><X className="w-4 h-4"/></div>
                                 )}
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
         </div>
      </div>
    </div>
  );
}
