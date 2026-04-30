import React from 'react';
import { motion } from 'motion/react';
import { Users, Target, BookOpen, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen py-24 space-y-32 relative overflow-hidden text-slate-600 font-sans">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary-50 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-primary-50 blur-[150px] rounded-full"></div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary-50 blur-[60px] rounded-full pointer-events-none"></div>
          <h1 className="text-5xl lg:text-7xl font-bold font-bengali text-slate-900 mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-600 to-indigo-600 relative z-10">আমাদের সম্পর্কে</h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium relative z-10">
            জুনায়েদ একাডেমি বাংলাদেশের অন্যতম শীর্ষস্থানীয় ই-লার্নিং প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য হলো 
            দেশের প্রতিটি প্রান্তে মানসম্মত শিক্ষা পৌঁছে দেয়া এবং শিক্ষার্থীদের ক্যারিয়ার গড়তে সঠিক দিকনির্দেশনা প্রদান করা।
          </p>
        </motion.div>
      </section>

      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10 relative z-20"
            >
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold font-bengali text-slate-900 leading-tight">সহজ ও আনন্দদায়ক <br/> <span className="text-primary-600">শেখার অভিজ্ঞতা</span></h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  আমরা বিশ্বাস করি, শেখা হতে হবে আনন্দদায়ক ও আকর্ষণীয়। তাই আমাদের প্রতিটি ক্লাস এমনভাবে সাজানো হয়েছে যেন 
                  শিক্ষার্থীরা মুখস্থ না করে বুঝে শিখতে পারে। 
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-5 p-6 bg-white  rounded-[2rem] border border-slate-200 shadow-sm hover:border-primary-100 transition-colors group">
                  <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl shadow-sm group-hover:scale-110 transition-transform"><Target className="w-8 h-8" /></div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-2 font-bengali">লক্ষ্য</h3>
                    <p className="text-slate-500">সব্বার জন্য সাশ্রয়ী মূল্যে মানসম্মত শিক্ষা নিশ্চিত করা।</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-6 bg-white  rounded-[2rem] border border-slate-200 shadow-sm hover:border-primary-100 transition-colors group">
                  <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl shadow-sm group-hover:scale-110 transition-transform"><Heart className="w-8 h-8" /></div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-2 font-bengali">ভিশন</h3>
                    <p className="text-slate-500">একটি দক্ষ ও শিক্ষিত প্রজন্ম গড়ে তোলা যারা দেশের ভবিষ্যৎ নেতৃত্ব দিবে।</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="relative lg:h-[600px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-indigo-600/20 blur-[80px] rounded-full w-full h-full transform scale-90 -z-10"></div>
              <div className="relative w-full max-w-lg aspect-[4/5] rounded-[3rem] overflow-hidden border border-slate-200 shadow-sm group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80" 
                  alt="Zunayed Academy Team" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-primary-50 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-1000"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20 relative z-10">
        <div className="bg-white  rounded-[3rem] p-12 md:p-20 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 via-indigo-500/5 to-transparent blur-3xl group-hover:opacity-100 opacity-50 transition-opacity duration-500"></div>
          <h2 className="text-3xl md:text-5xl font-bold font-bengali text-slate-900 mb-8 relative z-10 drop-shadow-sm">আমাদের সাথে যুক্ত হোন</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 relative z-10 leading-relaxed">
            হাজারো শিক্ষার্থীর এই বিশাল কমিউনিটিতে আপনাকে স্বাগতম। আজই আমাদের যেকোনো কোর্সে ভর্তি হয়ে 
            আপনার লক্ষ্য পূরণের পথে প্রথম ধাপ ফেলুন।
          </p>
          <Link to="/courses" className="inline-flex items-center justify-center px-10 py-5 bg-primary-600 text-white rounded-2xl font-bold text-xl hover:shadow-sm transition-all relative overflow-hidden group/btn z-10">
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10 flex items-center">কোর্সগুলো দেখুন <ArrowRight className="ml-3 h-6 w-6 group-hover/btn:translate-x-2 transition-transform" /></span>
          </Link>
        </div>
      </section>
    </div>
  );
}
