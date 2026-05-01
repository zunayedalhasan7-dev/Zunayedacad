import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile, getDashboardPath, login, loginWithGoogle } = useAuth();

  // Redirect if already logged in and profile loaded
  React.useEffect(() => {
    if (user && profile) {
      navigate(getDashboardPath(), { replace: true });
    }
  }, [user, profile, navigate, getDashboardPath]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      // Redirection handled by useEffect
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.message?.includes('invalid-credential')) {
        setError('ইমেইল অথবা পাসওয়ার্ড ভুল। আপনি কি আগে রেজিস্টার করেছেন? না করলে এই ইমেইল দিয়ে রেজিস্টার করুন।');
      } else {
        setError(err.message || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      }
      console.error(err);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      // Redirection handled by useEffect
    } catch (err: any) {
      setError(err.message || 'গুগল লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden pt-20">
      {/* Premium background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-primary-100/30 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-100/20 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative z-10"
      >
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-10 text-center">
            <Link to="/" className="inline-block mb-8 transition-transform hover:scale-105 active:scale-95">
              <Logo className="h-10" />
            </Link>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">স্বাগতম!</h2>
            <p className="text-slate-500 mt-2 text-lg">আপনার একাউন্টে প্রবেশ করুন</p>
          </div>

          <div className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-6">
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
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 ml-1 flex justify-between">
                  <span>পাসওয়ার্ড</span>
                  <Link to="/forgot-password" title="পাসword ভুলে গেছেন?" className="text-primary-600 font-bold hover:text-primary-700 transition-colors text-xs">ভুলে গেছেন?</Link>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none text-slate-900 placeholder-slate-400 transition-all font-medium"
                    placeholder="••••••••"
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
                    <span>লগইন করুন</span>
                    <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center gap-4">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">অথবা</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5 group-hover:scale-110 transition-transform" alt="Google" />
              <span>গুগল দিয়ে প্রবেশ করুন</span>
            </button>

            <p className="text-center text-slate-500 font-medium">
              অ্যাকাউন্ট নেই?{' '}
              <Link to="/register" className="text-primary-600 font-black hover:text-primary-700 transition-colors decoration-primary-600/30 underline underline-offset-4">নতুন তৈরি করুন</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
