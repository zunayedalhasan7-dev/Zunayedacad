import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="bg-slate-50 min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <img 
              src="https://img.freepik.com/free-vector/3d-cartoon-delivery-guy-character-concept-design_107791-16474.jpg" 
              alt="Contact Illustration"
              className="w-48 h-48 object-contain mx-auto drop-shadow-xl"
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-slate-900"
          >
            আমাদের সাথে যোগাযোগ করুন
          </motion.h1>
          <p className="text-slate-500 text-lg font-medium">
            আপনার যে কোন প্রশ্ন, মতামত বা অভিযোগ জানাতে নিচের ফর্মটি পূরণ করুন অথবা সরাসরি আমাদের কল করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start space-x-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary-50 p-4 rounded-2xl text-primary-600">
                <Mail className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">ইমেইল</h3>
                <p className="text-slate-500 text-sm font-medium">support@zunayedacademy.com</p>
                <p className="text-slate-500 text-sm font-medium">info@zunayedacademy.com</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start space-x-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-50 p-4 rounded-2xl text-green-600">
                <Phone className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">কল করুন</h3>
                <p className="text-slate-500 text-sm font-medium">০১৭০০-০০০০০০</p>
                <p className="text-slate-500 text-sm font-medium">০১৮০০-০০০০০০</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start space-x-6 hover:shadow-lg transition-shadow">
              <div className="bg-orange-50 p-4 rounded-2xl text-orange-600">
                <MapPin className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">ঠিকানা</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">ধানমন্ডি, ঢাকা - ১২০৯<br />বাংলাদেশ</p>
              </div>
            </div>

            {/* Social or Message Badge */}
            <div className="bg-primary-600 p-8 rounded-3xl text-white space-y-4">
              <MessageSquare className="h-8 w-8" />
              <h3 className="font-bold text-xl">লাইভ সাপোর্ট</h3>
              <p className="text-primary-100 text-sm leading-relaxed">আমাদের সাপোর্ট টিম সকাল ১০টা থেকে রাত ১০টা পর্যন্ত অনলাইনে থাকেন আপনার যে কোন সমস্যার সমাধানে।</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">আপনার নাম</label>
                  <input
                    type="text"
                    required
                    placeholder="জুনায়েদ আহমেদ"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">ইমেইল এড্রেস</label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">বিষয় (Subject)</label>
                  <input
                    type="text"
                    required
                    placeholder="কিসের জন্য যোগাযোগ করছেন?"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">বিস্তারিত মেসেজ</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="আপনার মেসেজ এখানে লিখুন..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium placeholder:text-slate-400 resize-none"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white font-bold py-5 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center space-x-3 text-lg group"
                  >
                    <span>মেসেজ পাঠান</span>
                    <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
