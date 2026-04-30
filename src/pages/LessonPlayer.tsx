import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle2, ChevronLeft, Menu, X, FileText, HelpCircle, MessageSquare, Video } from 'lucide-react';
import { motion } from 'motion/react';

export default function LessonPlayer() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const modules = [
    {
      id: 1,
      title: 'মডিউল ১: সাধারণ গণিত বেসিক',
      lessons: [
        { id: 101, title: 'বাস্তব সংখ্যা (Real Numbers)', duration: '15:20', completed: true },
        { id: 102, title: 'সেট ও ফাংশন', duration: '22:10', completed: true },
        { id: 103, title: 'বীজগাণিতিক রাশি', duration: '18:45', completed: false, current: true },
      ]
    },
    {
      id: 2,
      title: 'মডিউল ২: জ্যামিতি অধ্যায়',
      lessons: [
        { id: 201, title: 'রেখা, কোণ ও ত্রিভুজ', duration: '25:00', completed: false },
        { id: 202, title: 'ব্যবহারিক জ্যামিতি', duration: '20:15', completed: false },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-primary-50 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[30%] bg-primary-50 blur-[120px] rounded-full"></div>
      </div>

      {/* Top Navbar */}
      <nav className="bg-white  text-slate-900 h-16 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0 border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-slate-500 hover:text-primary-600 transition-colors bg-slate-50 p-2 rounded-lg hover:bg-slate-100">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="hidden sm:block border-l border-slate-200 pl-4">
            <h1 className="font-bold text-sm lg:text-base line-clamp-1 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">SSC Math Special Batch</h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
           {/* Progress */}
           <div className="hidden md:flex items-center gap-3">
              <div className="text-xs font-medium text-slate-500">আপনার প্রগ্রেস: <span className="text-primary-600 font-sans font-bold">৪০%</span></div>
              <div className="w-32 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                 <div className="h-full bg-primary-600 w-[40%] rounded-full shadow-sm" />
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
            {/* Video Player Placeholder */}
            <div className="w-full bg-black aspect-video relative group shadow-sm border-b border-slate-200 lg:p-4">
               <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-slate-900/40 lg:rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-primary-50 group-hover:bg-primary-50 transition-colors"></div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center  border border-primary-100 shadow-sm cursor-pointer hover:shadow-sm transition-shadow"
                  >
                     <PlayCircle className="w-10 h-10 text-primary-600 ml-1" />
                  </motion.div>
               </div>
               {/* Note: Use real video player like video.js or standard HTML5 video here */}
            </div>

            {/* Video Info & Tabs */}
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
               <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">বীজগাণিতিক রাশি - পর্ব ১</h1>
               
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
                        activeTab === tab.id ? 'border-primary-100 text-primary-600' : 'border-transparent text-slate-500 hover:text-primary-600'
                      }`}
                    >
                      {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-50 shadow-sm"></div>}
                      {tab.icon} {tab.label}
                    </button>
                  ))}
               </div>

               <div className="prose prose-invert max-w-none text-slate-600">
                  {activeTab === 'overview' && (
                     <div className="bg-white  p-6 lg:p-8 rounded-2xl border border-slate-200 space-y-4">
                        <p className="text-lg leading-relaxed">এই ক্লাসে আমরা বীজগাণিতিক রাশির প্রাথমিক ধারণা এবং কিছু গুরুত্বপূর্ণ সূত্র নিয়ে আলোচনা করবো। সূত্রগুলো মুখস্থ না করে কীভাবে বুঝে মনে রাখতে হয়, তার সহজ উপায় শেখানো হবে।</p>
                        <h3 className="text-slate-900 font-bold text-xl mt-6 mb-4">এই ক্লাসে যা যা শিখবো:</h3>
                        <ul className="space-y-2 list-none p-0">
                           {['রাশি ও পদের ধারণা', 'বর্গ নির্ণয়ের সূত্রাবলি', 'ঘন নির্ণয়ের সূত্রাবলি', 'প্র্যাকটিস প্রবলেম সলভিং'].map((item, i) => (
                             <li key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                               <CheckCircle2 className="w-5 h-5 text-primary-600" />
                               <span>{item}</span>
                             </li>
                           ))}
                        </ul>
                     </div>
                  )}
                  {activeTab === 'qa' && (
                     <div className="bg-white  p-10 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
                        <HelpCircle className="w-12 h-12 text-slate-600 mb-4" />
                        <p className="text-lg text-slate-500">এই লেসন সম্পর্কে আপনার কোনো প্রশ্ন থাকলে এখানে জিজ্ঞেস করতে পারেন।</p>
                        <button className="mt-6 px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-medium hover:bg-white/20 hover:text-primary-600 transition-colors border border-slate-200 hover:border-primary-100">
                           নতুন প্রশ্ন করুন
                        </button>
                     </div>
                  )}
                  {activeTab === 'notes' && (
                     <div className="bg-white  p-10 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
                        <FileText className="w-12 h-12 text-slate-600 mb-4" />
                        <p className="text-lg text-slate-500">এখানে আপনি আপনার নিজের নোট লিখে রাখতে পারবেন।</p>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Course Curriculum Sidebar */}
         <div className={`${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} fixed lg:static inset-y-0 right-0 w-80 bg-white  border-l border-slate-200 z-20 transition-transform duration-300 ease-in-out flex flex-col pt-16 lg:pt-0 shadow-sm`}>
            <div className="p-5 border-b border-slate-200 shrink-0 bg-slate-50">
               <h2 className="font-bold text-slate-900 flex items-center gap-2">
                 <Video className="w-5 h-5 text-primary-600" />
                 কোর্সের কন্টেন্ট
               </h2>
            </div>
            
            <div className="overflow-y-auto flex-1 hide-scrollbar">
               {modules.map((module) => (
                  <div key={module.id} className="border-b border-slate-200">
                     <div className="px-5 py-4 bg-white font-bold text-sm text-slate-600 tracking-wide border-t border-slate-200 first:border-0 sticky top-0 z-10 shadow-sm shadow-black/20">
                        {module.title}
                     </div>
                     <div className="divide-y divide-white/5">
                        {module.lessons.map(lesson => (
                           <div 
                             key={lesson.id} 
                             className={`p-4 flex gap-3 hover:bg-slate-50 cursor-pointer transition-all group ${
                               lesson.current ? 'bg-primary-50 border-l-2 border-primary-100' : 'border-l-2 border-transparent'
                             }`}
                           >
                              <div className="mt-0.5 shrink-0">
                                 {lesson.completed ? (
                                    <div className="relative">
                                      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-50"></div>
                                      <CheckCircle2 className="w-5 h-5 text-emerald-400 relative z-10" />
                                    </div>
                                 ) : lesson.current ? (
                                     <div className="relative">
                                      <div className="absolute inset-0 bg-primary-50 rounded-full blur-sm opacity-50 animate-pulse"></div>
                                      <PlayCircle className="w-5 h-5 text-primary-600 relative z-10" />
                                    </div>
                                 ) : (
                                    <PlayCircle className="w-5 h-5 text-slate-600 group-hover:text-slate-500 transition-colors" />
                                 )}
                              </div>
                              <div>
                                 <h4 className={`text-sm font-medium leading-snug mb-1 transition-colors ${
                                    lesson.current ? 'text-primary-600' : 'text-slate-600 group-hover:text-slate-900'
                                 }`}>
                                    {lesson.title}
                                 </h4>
                                 <div className={`flex items-center text-xs font-sans ${lesson.current ? 'text-primary-600/80' : 'text-slate-500'}`}>
                                    <Video className="w-3 h-3 mr-1" /> {lesson.duration}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
