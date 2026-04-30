import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="bg-slate-50 min-h-screen py-24 px-4 relative overflow-hidden font-sans">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary-50 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-primary-50 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-primary-50 blur-[50px] rounded-full pointer-events-none scale-75"></div>
            <img 
              src="https://img.freepik.com/free-vector/3d-cartoon-delivery-guy-character-concept-design_107791-16474.jpg" 
              alt="Contact Illustration"
              className="w-48 h-48 object-contain mx-auto filter drop-shadow-sm relative z-10 grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold font-bengali text-slate-900 mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-500 to-indigo-600 drop-shadow-sm"
          >
            আমাদের সাথে যোগাযোগ করুন
          </motion.h1>
          <p className="text-slate-600 text-lg font-medium leading-relaxed">
            আপনার যে কোন প্রশ্ন, মতামত বা অভিযোগ জানাতে নিচের ফর্মটি পূরণ করুন অথবা সরাসরি আমাদের কল করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white  p-8 rounded-[2rem] shadow-sm border border-slate-200 flex items-start space-x-6 hover:shadow-sm hover:border-primary-100 transition-all group">
              <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 shadow-sm group-hover:bg-primary-50 transition-colors">
                <Mail className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold font-bengali text-slate-900 text-xl mb-1">ইমেইল</h3>
                <p className="text-slate-500 text-[15px] font-medium font-sans">support@zunayedacademy.com</p>
                <p className="text-slate-500 text-[15px] font-medium font-sans">info@zunayedacademy.com</p>
              </div>
            </div>

            <div className="bg-white  p-8 rounded-[2rem] shadow-sm border border-slate-200 flex items-start space-x-6 hover:shadow-sm hover:border-emerald-400/30 transition-all group">
              <div className="bg-emerald-400/10 p-4 rounded-2xl text-emerald-400 shadow-sm group-hover:bg-emerald-400/20 transition-colors">
                <Phone className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold font-bengali text-slate-900 text-xl mb-1">কল করুন</h3>
                <p className="text-slate-500 text-[15px] font-medium font-sans">০১৭০০-০০০০০০</p>
                <p className="text-slate-500 text-[15px] font-medium font-sans">০১৮০০-০০০০০০</p>
              </div>
            </div>

            <div className="bg-white  p-8 rounded-[2rem] shadow-sm border border-slate-200 flex items-start space-x-6 hover:shadow-sm hover:border-amber-400/30 transition-all group">
              <div className="bg-amber-400/10 p-4 rounded-2xl text-amber-400 shadow-sm group-hover:bg-amber-400/20 transition-colors">
                <MapPin className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold font-bengali text-slate-900 text-xl mb-1">ঠিকানা</h3>
                <p className="text-slate-500 text-[15px] font-medium leading-relaxed font-sans">ধানমন্ডি, ঢাকা - ১২০৯<br />বাংলাদেশ</p>
              </div>
            </div>

            {/* Social or Message Badge */}
            <div className="bg-primary-600 p-8 rounded-[2rem] text-white space-y-5 border border-primary-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-50 blur-[40px] rounded-full"></div>
              <MessageSquare className="h-10 w-10 text-primary-600 drop-shadow-sm" />
              <h3 className="font-bold font-bengali text-2xl relative z-10">লাইভ সাপোর্ট</h3>
              <p className="text-slate-600 text-[15px] leading-relaxed relative z-10">আমাদের সাপোর্ট টিম সকাল ১০টা থেকে রাত ১০টা পর্যন্ত অনলাইনে থাকেন আপনার যে কোন সমস্যার সমাধানে।</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <div className="bg-white  p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-200 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-indigo-600/5 opacity-50"></div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-3">
                  <label className="text-[15px] font-bold font-bengali text-slate-600 ml-1">আপনার নাম</label>
                  <input
                    type="text"
                    required
                    placeholder="জুনায়েদ আহমেদ"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-primary-100 transition-all text-[15px] text-slate-900 font-medium placeholder:text-slate-500 shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[15px] font-bold font-bengali text-slate-600 ml-1">ইমেইল এড্রেস</label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-primary-100 transition-all text-[15px] text-slate-900 font-medium placeholder:text-slate-500 shadow-inner"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[15px] font-bold font-bengali text-slate-600 ml-1">বিষয় (Subject)</label>
                  <input
                    type="text"
                    required
                    placeholder="কিসের জন্য যোগাযোগ করছেন?"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-primary-100 transition-all text-[15px] text-slate-900 font-medium placeholder:text-slate-500 shadow-inner"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[15px] font-bold font-bengali text-slate-600 ml-1">বিস্তারিত মেসেজ</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="আপনার মেসেজ এখানে লিখুন..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-primary-100 transition-all text-[15px] text-slate-900 font-medium placeholder:text-slate-500 resize-none shadow-inner"
                  ></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white font-bold py-5 rounded-2xl hover:shadow-sm transition-all flex items-center justify-center space-x-3 text-xl group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out pointer-events-none"></div>
                    <span className="relative z-10 font-bengali">মেসেজ পাঠান</span>
                    <Send className="h-6 w-6 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
