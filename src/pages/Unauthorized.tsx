import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
        </motion.div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">403 Access Denied</h1>
        <p className="text-lg text-slate-600 mb-8 font-medium">
          দুঃখিত, আপনার এই পেজটি দেখার অনুমতি নেই। আপনি যদি মনে করেন এটি ভুল হচ্ছে, তবে এডমিনের সাথে যোগাযোগ করুন।
        </p>
        
        <div className="flex flex-col space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
          >
            <ArrowLeft className="w-5 h-5" />
            হোমপেজে ফিরে যান
          </Link>
          
          <Link
            to="/dashboard"
            className="text-slate-500 font-bold hover:text-slate-900 transition-colors"
          >
            আপনার ড্যাশবোর্ডে জান
          </Link>
        </div>
      </div>
    </div>
  );
}
