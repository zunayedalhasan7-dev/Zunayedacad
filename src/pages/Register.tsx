import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { motion } from 'motion/react';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden min-h-[600px]">
        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 lg:p-12 order-2 lg:order-1"
        >
          <div className="text-center lg:text-left mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 text-primary-600 mb-6 focus:outline-none">
              <div className="bg-primary-600 p-1.5 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Zunayed Academy</span>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 font-bengali">অ্যাকাউন্ট তৈরি করুন</h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">আজই আপনার শেখার যাত্রা শুরু করুন</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">আপনার নাম</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    placeholder="জুনায়েদ আহমেদ"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">ইমেইল এড্রেস</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">পাসওয়ার্ড</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    placeholder="কমপক্ষে ৬ ক্যারেক্টার"
                  />
                </div>
              </div>

              {/* Account type selection removed, defaults to STUDENT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center space-x-2 disabled:opacity-70 group"
              >
                {loading ? 'প্রসেসিং...' : (
                  <>
                    <span>জয়েন করুন</span>
                    <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 pt-2">
              আগে থেকেই অ্যাকাউন্ট আছে?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:underline">লগইন করুন</Link>
            </p>
          </div>
        </motion.div>

        {/* Illustration Side */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-primary-600 p-12 text-white text-center space-y-8 relative overflow-hidden h-full order-1 lg:order-2">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full -mr-32 -mb-32 blur-3xl animate-pulse" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
          >
            <img 
              src="https://img.freepik.com/free-vector/3d-cartoon-teenager-studying-with-books_107791-16476.jpg" 
              alt="Register Illustration"
              className="w-full max-w-sm h-auto drop-shadow-2xl"
            />
          </motion.div>
          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl font-bold">একাডেমি পরিবারে স্বাগতম</h2>
            <p className="text-primary-100">আপনার ব্যক্তিগত প্রোফাইল তৈরি করুন এবং হাজারো কোর্সের ভান্ডারে এক্সেস পান। শিখুন আপনার নিজের স্বাচ্ছন্দ্যে।</p>
          </div>
        </div>
      </div>
    </div>
  );
}
