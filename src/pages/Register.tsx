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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden pt-20">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-primary-50 opacity-[0.05] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[40%] bg-primary-50 opacity-[0.05] blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-0 items-stretch bg-white  rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] relative z-10">
        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 lg:p-12 order-2 lg:order-1 flex flex-col justify-center bg-white"
        >
          <div className="text-center lg:text-left mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
              <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                <GraduationCap className="h-6 w-6 text-primary-600" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-indigo-600 transition-all">Zunayed Academy</span>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 font-bengali">অ্যাকাউন্ট তৈরি করুন</h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">আজই আপনার শেখার যাত্রা শুরু করুন</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-medium border border-red-500/20 animate-shake shadow-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">আপনার নাম</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-primary-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-600 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none text-slate-900 placeholder-slate-600 transition-all text-sm group-focus-within:border-primary-100"
                      placeholder="জুনায়েদ আহমেদ"
                    />
                  </div>
                </div>
              </div>

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
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none text-slate-900 placeholder-slate-600 transition-all text-sm group-focus-within:border-primary-100"
                      placeholder="example@gmail.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">পাসওয়ার্ড</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-primary-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-600 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none text-slate-900 placeholder-slate-600 transition-all text-sm group-focus-within:border-primary-100"
                      placeholder="কমপক্ষে ৬ ক্যারেক্টার"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl hover:shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-70 group mt-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? 'প্রসেসিং...' : (
                    <>
                      <span>জয়েন করুন</span>
                      <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 pt-2">
              আগে থেকেই অ্যাকাউন্ট আছে?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:text-primary-600/80 hover:underline transition-colors">লগইন করুন</Link>
            </p>
          </div>
        </motion.div>

        {/* Illustration Side */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-bl from-primary-50 to-slate-100 p-12 text-slate-900 text-center space-y-8 relative overflow-hidden h-full order-1 lg:order-2 border-l border-slate-200">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary-50 rounded-full -ml-32 -mt-32 blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mb-32 blur-[100px] animate-pulse" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-primary-600 to-indigo-600 opacity-20 blur-2xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80" 
              alt="Register"
              className="w-full max-w-sm h-64 object-cover rounded-2xl drop-shadow-sm border border-slate-200 relative z-10"
            />
          </motion.div>
          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">একাডেমি পরিবারে স্বাগতম</h2>
            <p className="text-slate-500">আপনার ব্যক্তিগত প্রোফাইল তৈরি করুন এবং হাজারো কোর্সের ভান্ডারে এক্সেস পান। শিখুন আপনার নিজের স্বাচ্ছন্দ্যে।</p>
          </div>
        </div>
      </div>
    </div>
  );
}
