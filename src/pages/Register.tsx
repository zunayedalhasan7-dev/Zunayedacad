import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { motion } from 'motion/react';
import Logo from '../components/Logo';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile, getDashboardPath, register, login } = useAuth();

  // Redirect if already logged in and profile loaded
  React.useEffect(() => {
    if (user && profile) {
      navigate(getDashboardPath(), { replace: true });
    }
  }, [user, profile, navigate, getDashboardPath]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(email, password, name);
      // After registration, log them in or redirect to login
      await login(email, password);
      // Redirection handled by useEffect
    } catch (err: any) {
      setError(err.message || 'রেজিস্ট্রেশন সফল হয়নি। ইমেইলটি আগে ব্যবহার করা থাকতে পারে।');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden pt-20">
      {/* Premium background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] right-[-5%] w-[60%] h-[60%] bg-indigo-100/30 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-15%] left-[-5%] w-[50%] h-[50%] bg-primary-100/20 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative z-10"
      >
        {/* Form Side */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block mb-8 transition-transform hover:scale-105 active:scale-95">
              <Logo className="h-10" />
            </Link>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">অ্যাকাউন্ট তৈরি করুন</h2>
            <p className="text-slate-500 mt-2 text-lg">সেরা শেখার অভিজ্ঞতা আপনার হাতের মুঠোয়</p>
          </div>

          <div className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 ml-1">আপনার নাম</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none text-slate-900 placeholder-slate-400 transition-all font-medium"
                    placeholder="জুনায়েদ আহমেদ"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 ml-1">ইমেইল এড্রেস</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none text-slate-900 placeholder-slate-400 transition-all font-medium"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 ml-1">পাসওয়ার্ড</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none text-slate-900 placeholder-slate-400 transition-all font-medium"
                    placeholder="কমপক্ষে ৬ ক্যারেক্টার"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group relative overflow-hidden"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>জয়েন করুন</span>
                    <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 font-medium">
              আগে থেকেই অ্যাকাউন্ট আছে?{' '}
              <Link to="/login" className="text-primary-600 font-black hover:text-primary-700 transition-colors decoration-primary-600/30 underline underline-offset-4">লগইন করুন</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
