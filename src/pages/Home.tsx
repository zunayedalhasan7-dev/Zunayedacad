import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, PlayCircle, Star, Users, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroIllustration, AcademicIllustration, SkillsIllustration, DashboardIllustration, EmptyCoursesIllustration, PaymentIllustration, LanguageIllustration, LabIllustration } from '../components/Illustrations';

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary-50/50 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-8"
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight">
                আপনার ভবিষ্যৎ <br /> 
                <span className="text-primary-600">গড়তে আমরা প্রস্তুত</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                জুনায়েদ একাডেমিতে আমরা নিয়ে এসেছি SSC, HSC এবং বিভিন্ন স্কিল ডেভেলপমেন্টের জন্য বিশ্বমানের কোর্স। আমাদের বিশেষজ্ঞ শিক্ষকদের সাথে শিখুন একদম সহজ পদ্ধতিতে।
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                  শুরু করুন আজই <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/free-courses" className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
                  ফ্রি ক্লাস দেখুন
                </Link>
              </div>
              <div className="flex items-center space-x-6 pt-4 text-sm text-slate-500">
                <div className="flex items-center"><Users className="mr-2 h-4 w-4" /> ১০,০০০+ শিক্ষার্থী</div>
                <div className="flex items-center"><Star className="mr-2 h-4 w-4 text-amber-400" /> ৪.৯/৫ রেটিং</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              {/* Decorative 3D-like Blobs */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-300/30 rounded-full blur-3xl animate-pulse -z-10" />
              <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-blue-300/20 rounded-full blur-[100px] -z-10" />
              
              <div className="relative z-10 p-4">
                {/* Main 3D Illustration Container */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <HeroIllustration />
                  
                  {/* Floating elements tied to illustration */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-xl shadow-lg flex items-center justify-center text-white"
                  >
                    <BookOpen className="h-6 w-6" />
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Floating Achievement Card */}
              <motion.div 
                animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-12 bg-white p-6 rounded-3xl shadow-2xl hidden xl:block border border-slate-50 z-30"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-2xl">
                    <Award className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">SSC স্পেশাল</div>
                    <div className="text-sm text-slate-500">১ম স্থান নিশ্চিত প্রস্তুতি</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">জনপ্রিয় কোর্সসমূহ</h2>
            <p className="text-slate-500">আমাদের সবচেয়ে পছন্দের কোর্সগুলো দিয়ে আপনার যাত্রা শুরু করুন</p>
          </div>
          <Link to="/courses" className="text-primary-600 font-semibold hover:underline hidden sm:block">সবগুলো দেখুন</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'SSC গণিত স্পেশাল ব্যাচ', instructor: 'জুনায়েদ আহমেদ', price: 999, originalPrice: 1500, students: 1200, rating: 4.9, thumb: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&auto=format&fit=crop&q=60' },
            { title: 'HSC ইংরেজি কুইক সল্ভ', instructor: 'তানজিল হাসান', price: 599, originalPrice: 800, students: 850, rating: 4.8, thumb: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60' },
            { title: 'গ্রাফিক ডিজাইন ফর বিগিনারস', instructor: 'রেজওয়ান করিম', price: 1200, originalPrice: 2000, students: 2500, rating: 5.0, thumb: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60' },
          ].map((course, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={course.thumb} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary-600 flex items-center shadow-sm">
                  <Star className="mr-1 h-3 w-3 fill-primary-600" /> {course.rating}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-xs font-bold text-primary-600 uppercase tracking-widest">SSC / HSC</div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors leading-tight">
                  {course.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="flex items-center"><Users className="mr-1 h-4 w-4" /> {course.students} শিক্ষার্থী</span>
                  <span className="flex items-center"><BookOpen className="mr-1 h-4 w-4" /> ১০ টি মডিউল</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">৳{course.price}</span>
                    <span className="ml-2 text-sm text-slate-400 line-through">৳{course.originalPrice}</span>
                  </div>
                  <Link to="/courses/1" className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">১০,০০০+</div>
              <div className="text-primary-200">সফল শিক্ষার্থী</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">১০০+</div>
              <div className="text-primary-200">ভিডিও কোর্স</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">২০+</div>
              <div className="text-primary-200">দক্ষ ইনস্ট্রাক্টর</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">২৪/৭</div>
              <div className="text-primary-200">সাপোর্ট সিস্টেম</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">আমাদের ক্যাটাগরি সমূহ</h2>
          <p className="text-slate-500">আপনার প্রয়োজনীয় ক্যাটাগরি অনুযায়ী শিখতে শুরু করুন</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              title: "SSC ও HSC প্রস্তুতি", 
              desc: "স্কুল ও কলেজের সেরা প্রস্তুতি", 
              illustration: <AcademicIllustration />,
              color: "bg-blue-50"
            },
            { 
              title: "স্কিল ডেভেলপমেন্ট", 
              desc: "ফ্রিল্যান্সিং ও প্রফেশনাল স্কিল", 
              illustration: <SkillsIllustration />,
              color: "bg-indigo-50"
            },
            { 
              title: "ভাষা শিক্ষা", 
              desc: "ইংরেজি ও অন্যান্য ভাষা", 
              illustration: <LanguageIllustration />,
              color: "bg-emerald-50"
            },
            { 
              title: "ফ্রি ওয়ার্কশপ", 
              desc: "হাতে কলমে শেখার সুযোগ", 
              illustration: <LabIllustration />,
              color: "bg-amber-50"
            }
          ].map((cat, i) => (
            <Link key={i} to="/courses" className="group">
              <div className={`${cat.color} rounded-[2rem] p-8 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-100 border border-transparent hover:border-primary-100 text-center flex flex-col items-center`}>
                <div className="w-40 h-40 mb-6 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                  {cat.illustration}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                <p className="text-slate-500 text-sm">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Instructors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">আমাদের অভিজ্ঞ ইনস্ট্রাক্টরবৃন্দ</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">সেরা শিক্ষকদের নির্দেশনায় আপনার প্রস্তুতি হোক সেরা। আমাদের মেন্টররা সবসময় আছেন আপনার পাশে।</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'জুনায়েদ আহমেদ', role: 'গণিত বিশেষজ্ঞ', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60' },
            { name: 'তামান্না ফাহমি', role: 'ইংরেজি মেন্টর', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60' },
            { name: 'তানজিল হাসান', role: 'পদার্থবিজ্ঞান ইনস্ট্রাক্টর', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60' },
            { name: 'সাদিয়া ইসলাম', role: 'রসায়ন বিশেষজ্ঞ', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60' },
          ].map((instructor, idx) => (
            <div key={idx} className="group text-center">
              <div className="relative mb-6 inline-block">
                <div className="absolute inset-0 bg-primary-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform shadow-lg" />
                <img 
                  src={instructor.image} 
                  alt={instructor.name} 
                  className="relative w-48 h-48 object-cover rounded-2xl border-4 border-white shadow-xl"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{instructor.name}</h3>
              <p className="text-primary-600 font-medium">{instructor.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Secure Payment Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-100">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 order-2 lg:order-1">
            <div className="w-full max-w-md mx-auto">
              <PaymentIllustration />
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2 space-y-8 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              নিরাপদ পেমেন্ট এবং <br /> 
              <span className="text-primary-600">সহজ এক্সেস</span>
            </h2>
            <p className="text-lg text-slate-600">
              আমরা বিকাশ, রকেট, নগদ সহ সকল জনপ্রিয় মোবাইল ব্যাংকিং সাপোর্ট করি। আপনার পেমেন্ট সফল হওয়ার সাথে সাথেই আপনি কোর্সটি সরাসরি আপনার ড্যাশবোর্ড থেকে দেখতে পারবেন। কোন ঝামেলা ছাড়াই শিখতে শুরু করুন।
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <div className="flex items-center space-x-2 text-slate-400 font-bold border border-slate-200 px-4 py-2 rounded-xl">
                <span>Bkash</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 font-bold border border-slate-200 px-4 py-2 rounded-xl">
                <span>Nagad</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 font-bold border border-slate-200 px-4 py-2 rounded-xl">
                <span>Rocket</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">আমাদের শিক্ষার্থীদের কথা</h2>
                <p className="text-slate-500 text-lg">হাজারো শিক্ষার্থী তাদের স্বপ্নের পথে এগিয়ে যাচ্ছে জুনায়েদ একাডেমির সাথে।</p>
              </div>
              
              <div className="grid gap-6">
                {[
                  { name: "আরিফ হোসেন", text: "জুনায়েদ ভাইয়ের ক্লাসের সবচেয়ে বড় গুণ হলো জটিল বিষয়গুলো খুব সহজে বুঝিয়ে দেয়া।", role: "শিক্ষার্থী, ঢাকা বিশ্ববিদ্যালয়" },
                  { name: "সুমাইয়া জান্নাত", text: "স্কিল ডেভেলপমেন্ট কোর্সের মাধ্যমে আমি এখন ঘরে বসেই ইনকাম করছি। ধন্যবাদ একাডেমিকে!", role: "ফ্রিল্যান্সার" }
                ].map((t, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-4"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-full shrink-0 flex items-center justify-center font-bold text-primary-600">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-slate-600 italic mb-3">"{t.text}"</p>
                      <h4 className="font-bold text-slate-900">{t.name}</h4>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-primary-600/10 rounded-full blur-[100px]" />
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-full max-w-md mx-auto relative z-10"
              >
                <DashboardIllustration />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
