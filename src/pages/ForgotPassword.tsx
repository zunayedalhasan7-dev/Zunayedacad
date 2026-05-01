import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { motion } from 'motion/react';
import Logo from '../components/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স চেক করুন।');
    } catch (err: any) {
      setError(err.message || 'পাসওয়ার্ড রিসেট লিংক পাঠাতে ব্যর্থ হয়েছে। ইমেইলটি সঠিক কিনা তা যাচাই করুন।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden pt-20">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-primary-50 opacity-[0.05] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[40%] bg-primary-50 opacity-[0.05] blur-[150px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo />
          </Link>
          <h2 className="text-3xl font-bold text-slate-900">পাসওয়ার্ড পুনরুদ্ধার</h2>
          <p className="text-slate-500 mt-2 text-sm">আপনার ইমেইল এড্রেস দিন, আমরা একটি রিসেট লিংক পাঠাবো</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-500/20">
            {error}
          </div>
        )}

        {message ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-emerald-500/10 p-5 rounded-full text-emerald-500">
                <CheckCircle className="h-12 w-12" />
              </div>
            </div>
            <p className="text-emerald-600 font-medium">{message}</p>
            <Link 
              to="/login"
              className="inline-flex items-center text-primary-600 font-bold hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> লগইন পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">ইমেইল এড্রেস</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-primary-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none text-slate-900 placeholder-slate-600 transition-all text-sm group-focus-within:border-primary-100"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl hover:shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-70 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'প্রসেসিং...' : (
                  <>
                    <span>লিংক পাঠান</span>
                    <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            <Link 
              to="/login"
              className="flex items-center justify-center text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors pt-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> লগইন এ ফিরে যান
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
