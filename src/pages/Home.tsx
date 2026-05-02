import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Star, Users, CheckCircle, ShieldCheck, BookOpen, ChevronRight, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroIllustration, AcademicIllustration, SkillsIllustration, LanguageIllustration, LabIllustration } from '../components/Illustrations';
import CourseCard from '../components/CourseCard';
import CategoryCard from '../components/CategoryCard';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Course } from '../types';

const CategoryIcon = ({ cat }: { cat: { img: string; link: string; alt: string } }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link to={cat.link} className="group flex flex-col items-center shrink-0 snap-center">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] transition-all drop-shadow-md rounded-2xl bg-white flex items-center justify-center overflow-hidden"
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-slate-200" />
        )}
        <img 
          src={cat.img} 
          alt={cat.alt} 
          onLoad={() => setLoaded(true)}
          className={`relative z-10 w-full h-full object-contain aspect-square transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`} 
        />
      </motion.div>
    </Link>
  );
};

export default function Home() {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const coursesQuery = query(
      collection(db, 'courses'), 
      where('status', '==', 'published'),
      limit(4)
    );
    
    const unsubscribe = onSnapshot(coursesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setPopularCourses(data);
      setLoading(false);
    }, (err) => {
      console.error('Home courses fetch error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-0 bg-slate-50 text-slate-600 relative overflow-hidden text-base">
      <ScrollToTopButton />
      
      {/* 2. Hero Section */}
      <section className="relative pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden z-10 w-full min-h-[85vh] flex flex-col justify-center">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left relative z-20"
            >
              <div className="inline-flex items-center space-x-3 bg-white/10 border border-slate-200/50 rounded-full px-4 md:px-5 py-1.5 md:py-2">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                </div>
                <span className="text-xs md:text-sm font-semibold bg-clip-text text-transparent bg-primary-600">দেশের সেরা লার্নিং প্ল্যাটফর্ম</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 drop-shadow-2xl">
                স্কিল শিখুন, <br className="hidden lg:block" />
                <span className="bg-clip-text text-transparent bg-primary-600 filter drop-shadow-sm">
                ক্যারিয়ার গঠন করুন</span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 font-medium px-4 md:px-0">
                SSC, HSC, অ্যাডমিশন কিংবা স্কিল ডেভেলপমেন্ট — সবকিছুর সেরা প্রস্তুতি এখন এক জায়গায়। আজই যুক্ত হোন আমাদের সাথে।
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link to="/courses" className="relative group inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white overflow-hidden w-full sm:w-auto">
                  <div className="absolute inset-0 bg-primary-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 hover:glow-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center">
                    কোর্স শুরু করুন <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link to="/free-courses" className="inline-flex items-center justify-center px-8 py-4 bg-slate-50  text-slate-900 rounded-xl font-bold hover:bg-slate-100 hover:border-primary-100 transition-all border border-slate-200 w-full sm:w-auto overflow-hidden group">
                  <span className="group-hover:text-primary-600 transition-colors">ফ্রি ক্লাস দেখুন</span>
                </Link>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-8 pt-8 text-sm text-slate-500 font-medium border-t border-slate-200 mt-8">
                <div className="flex items-center"><Users className="mr-3 h-5 w-5 text-primary-600" /> <span className="text-slate-900">১০,০০০+</span> শিক্ষার্থী</div>
                <div className="flex items-center"><CheckCircle className="mr-3 h-5 w-5 text-primary-600" /> <span className="text-slate-900">১০০+</span> কোর্স</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative w-full mx-auto lg:max-w-none flex justify-center items-center z-10"
            >
              <div className="relative w-[280px] sm:w-[360px] md:w-full max-w-lg aspect-square">
                {/* 3D Floating elements */}
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute z-20 -top-5 -left-5 sm:-top-10 sm:-left-10 bg-white  border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-sm scale-90 sm:scale-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-primary-50 p-2 sm:p-3 rounded-xl"><Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" /></div>
                    <div><p className="text-[10px] sm:text-xs text-slate-500">Rating</p><p className="font-bold text-sm sm:text-base text-slate-900">4.9/5</p></div>
                  </div>
                </motion.div>
                
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }} className="absolute z-20 -bottom-5 -right-5 sm:-bottom-10 sm:-right-10 bg-white  border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-sm scale-90 sm:scale-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-primary-50 p-2 sm:p-3 rounded-xl"><Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" /></div>
                    <div><p className="text-[10px] sm:text-xs text-slate-500">Total Students</p><p className="font-bold text-sm sm:text-base text-slate-900">10K+</p></div>
                  </div>
                </motion.div>

                {/* Main heroic visual -- simplified to prevent scroll lag */}
                <div className="absolute inset-0 bg-primary-600/10 rounded-full blur-2xl"></div>
                <div className="relative w-full h-full bg-white border border-slate-200 rounded-full shadow-sm overflow-hidden flex items-center justify-center">
                   <div className="w-3/4 h-3/4 rounded-full border border-slate-100 border-dashed animate-[spin_120s_linear_infinite] flex items-center justify-center" />
                   <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform hover:scale-105 duration-500 p-16 sm:p-20 md:p-12 lg:p-16">
                      <AcademicIllustration />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 mb-4 tracking-tight inline-block"
          >
            আপনার প্রয়োজনীয় ক্যাটাগরি
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-slate-500 text-lg">আপনার লক্ষ্য অনুযায়ী সঠিক কোর্সটি বেছে নিন</motion.p>
        </div>
        <div className="flex justify-center flex-wrap gap-6 md:gap-8 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {[
            { img: "https://i.postimg.cc/bwy15JVh/Picsart-26-05-01-22-44-50-817.png", link: "/courses?category=SSC", alt: "SSC" },
            { img: "https://i.postimg.cc/Jz0GJBd5/Picsart-26-05-01-22-55-00-523.png", link: "/courses?category=HSC", alt: "HSC" },
            { img: "https://i.postimg.cc/BQMjXCpz/Picsart-26-05-01-23-00-19-948.png", link: "/courses?category=Skill", alt: "Skill" },
            { img: "https://i.postimg.cc/44v7TG91/Picsart-26-05-01-23-08-14-083.png", link: "/ebooks", alt: "E-book" },
            { img: "https://i.postimg.cc/sxJvPPr5/Picsart-26-05-01-23-12-00-854.png", link: "/products", alt: "Shop" }
          ].map((cat, i) => (
            <motion.div
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
            >
              <CategoryIcon cat={cat} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4 & 5. Featured / Live Courses */}
      <section className="relative z-10 bg-white py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">জনপ্রিয় কোর্সসমূহ</h2>
              <p className="text-slate-500 text-lg">সবচেয়ে বেশি বিক্রিত এবং জনপ্রিয় কোর্সগুলো</p>
            </div>
            <Link 
              to="/courses" 
              className="group inline-flex items-center px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold hover:bg-slate-100 hover:border-primary-100 hover:text-primary-600 transition-all"
            >
              সবগুলো দেখুন <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl h-[380px] animate-pulse border border-slate-200" />
              ))
            ) : popularCourses.length > 0 ? (
              popularCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                >
                    <CourseCard
                      id={course.id}
                      title={course.title}
                      instructor={course.instructorName || 'Unknown Instructor'}
                      price={course.discountPrice || course.price}
                      originalPrice={course.discountPrice ? course.price : undefined}
                      rating={5.0}
                      thumb={course.thumbnail}
                    />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500 font-medium">কোন কোর্স পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Free Resources Section */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 relative flex flex-col lg:flex-row items-center"
           >
             <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-indigo-600/20 mix-blend-overlay z-0" />
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-screen" />
             
             <div className="p-8 md:p-16 relative z-10 flex-1 lg:pr-0 text-center lg:text-left">
               <span className="bg-primary-600 text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block shadow-sm">Free</span>
               <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 drop-shadow-md">ফ্রি স্টাডি ম্যাটেরিয়ালস</h2>
               <p className="text-slate-600 text-base md:text-lg mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed">আপনার প্রস্তুতির সুবিধার্থে আমাদের স্পেশাল নোটস এবং গাইডলাইন ডাইনলোড করুন একদম ফ্রিতে।</p>
               <Link to="/free-courses" className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:shadow-sm hover:scale-105 transition-all">
                 ডাউনলোড করুন <ArrowRight className="ml-2 h-5 w-5" />
               </Link>
             </div>
             
             <div className="flex-1 relative z-10 p-10 hidden lg:flex justify-center perspective-[1000px]">
               {/* Decorative grid */}
               <div className="grid grid-cols-2 gap-6" style={{ transform: 'rotateY(-15deg)', transformStyle: 'preserve-3d' }}>
                  <motion.div animate={{ z: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="bg-white  rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center">
                    <div className="bg-primary-50 p-4 rounded-full mb-4">
                      <BookOpen className="w-10 h-10 text-primary-600 drop-shadow-sm" />
                    </div>
                    <h4 className="text-slate-900 font-bold mb-2 text-lg">লেকচার শিট</h4>
                    <p className="text-slate-500 text-center text-sm">পিডিএফ ফরম্যাটে</p>
                  </motion.div>
                  
                  <motion.div animate={{ z: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 2 }} className="bg-white  rounded-2xl p-8 border border-slate-200 shadow-sm mt-12 flex flex-col items-center">
                    <div className="bg-primary-50 p-4 rounded-full mb-4">
                      <ShieldCheck className="w-10 h-10 text-primary-600 drop-shadow-sm" />
                    </div>
                    <h4 className="text-slate-900 font-bold mb-2 text-lg">মডেল টেস্ট</h4>
                    <p className="text-slate-500 text-center text-sm">ফ্রি এক্সাম</p>
                  </motion.div>
               </div>
             </div>
           </motion.div>
        </div>
      </section>

      {/* 7. Testimonials Carousel */}
      <section className="relative z-10 py-24 mb-10 overflow-hidden">
        {/* Background blobs for testimonials */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-r from-primary-600/5 to-indigo-600/5 blur-[150px] rounded-full z-0 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">শিক্ষার্থীদের সাফল্যের গল্প</h2>
            <p className="text-slate-500 text-lg">আমাদের একাডেমির শিক্ষার্থীরা যেভাবে তাদের স্বপ্ন ছুঁয়েছে</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "আরিফ হোসেন", text: "জুনায়েদ ভাইয়ের ক্লাসের সবচেয়ে বড় গুণ হলো জটিল বিষয়গুলো খুব সহজে বুঝিয়ে দেয়া। আমার HSC প্রস্তুতিতে এটি অনেক সাহায্য করেছে।", role: "শিক্ষার্থী, ঢাকা বিশ্ববিদ্যালয়" },
              { name: "সুমাইয়া জান্নাত", text: "স্কিল ডেভেলপমেন্ট কোর্সের মাধ্যমে আমি এখন ঘরে বসেই ইনকাম করছি। মেন্টরদের গাইডলাইন সত্যিই অসাধারণ!", role: "ফ্রিল্যান্সার" },
              { name: "রাকিবুল হাসান", text: "গণিতের ভয় এখন আর নেই। এত সুন্দর করে বেসিক থেকে পড়ানো হয় যে যেকোনো অধ্যায় পানির মত সহজ মনে হয়।", role: "SSC পরীক্ষার্থী" }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                className="bg-white  p-10 rounded-3xl shadow-xl border border-slate-200 flex flex-col justify-between group hover:border-primary-100 hover:shadow-sm transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div>
                    <div className="text-amber-400 mb-6 flex">
                    {[1,2,3,4,5].map(n => <Star key={n} className="w-5 h-5 fill-amber-400 drop-shadow-sm" />)}
                    </div>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed italic">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-4 border-t border-slate-200 pt-6">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center font-bold text-white shadow-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base group-hover:text-primary-600 transition-colors">{t.name}</h4>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. App Download Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px] overflow-hidden flex flex-col md:flex-row items-center border border-slate-200 shadow-sm relative"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-indigo-600/5 z-0"></div>
            
            <div className="flex-1 p-12 md:p-20 text-center md:text-left relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-[1.2]">
                    শেখা এখন আরও সহজ <br className="hidden md:block" /> 
                    আমাদের <span className="bg-clip-text text-transparent bg-primary-600">মোবাইল অ্যাপে</span>
                </h2>
                <ul className="space-y-5 mb-10 text-left max-w-sm mx-auto md:mx-0">
                    <li className="flex items-center text-slate-600 text-lg"><CheckCircle className="w-6 h-6 text-primary-600 mr-4 shrink-0 drop-shadow-sm" /> অফলাইনে ভিডিও দেখা</li>
                    <li className="flex items-center text-slate-600 text-lg"><CheckCircle className="w-6 h-6 text-primary-600 mr-4 shrink-0 drop-shadow-sm" /> লাইভ ক্লাস নোটিফিকেশন</li>
                    <li className="flex items-center text-slate-600 text-lg"><CheckCircle className="w-6 h-6 text-primary-600 mr-4 shrink-0 drop-shadow-sm" /> কুইজ ও এক্সাম</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                    <button className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:shadow-sm hover:scale-105 transition-all">
                       <Smartphone className="w-6 h-6 mr-3" /> Google Play
                    </button>
                    <button className="bg-slate-50 text-slate-900 border border-slate-200 hover:border-primary-100 px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-slate-50 transition-all">
                       <Smartphone className="w-6 h-6 mr-3" /> App Store
                    </button>
                </div>
            </div>
            <div className="flex-1 relative w-full h-[400px] md:h-[600px] flex items-end justify-center pt-10 perspective-[1200px]">
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-primary-600/10 to-transparent blur-2xl -z-10" />
                <motion.img 
                  animate={{ y: [0, -15, 0], rotateY: [-15, -12, -15] }} 
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop&q=80" 
                  alt="App Mockup" 
                  className="rounded-[30px] shadow-sm border-4 border-slate-800 h-4/5 object-cover max-w-xs md:max-w-sm ml-auto mr-10 hidden md:block translate-y-10" 
                />
                <motion.img 
                  animate={{ y: [0, 15, 0], rotateY: [10, 15, 10] }} 
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop&q=80" 
                  alt="App Mockup" 
                  className="rounded-[30px] shadow-sm border-4 border-slate-800 w-56 md:w-72 h-4/5 object-cover relative z-10 translate-y-4 md:translate-y-8 absolute bottom-0 right-[20%]" 
                />
            </div>
         </motion.div>
      </section>
    </div>
  );
}
