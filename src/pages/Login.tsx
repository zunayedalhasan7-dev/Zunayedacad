import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

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
      setError(err.message || 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে। আবার চেষ্টা করুন।');
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden min-h-[600px]">
        {/* Illustration Side */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-primary-600 p-12 text-white text-center space-y-8 relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl animate-pulse" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
          >
            <img 
              src="https://img.freepik.com/free-vector/3d-cartoon-online-registration-concept_107791-16477.jpg" 
              alt="Login Illustration"
              className="w-full max-w-sm h-auto drop-shadow-2xl"
            />
          </motion.div>
          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl font-bold">নতুন উচ্চতা জয় করুন</h2>
            <p className="text-primary-100">আপনার স্বপ্ন পূরণের যাত্রা শুরু হোক আমাদের সাথে। সেরা শিক্ষকদের টিপস এবং ট্রিকস জানুন।</p>
          </div>
        </div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 lg:p-12"
        >
          <div className="text-center lg:text-left mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 text-primary-600 mb-6 focus:outline-none">
              <div className="bg-primary-600 p-1.5 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Zunayed Academy</span>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900">লগইন করুন</h2>
            <p className="text-slate-500 mt-2 text-sm">আপনার ড্যাশবোর্ডে প্রবেশের তথ্য দিন</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-5">
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
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex justify-between">
                  <span>পাসওয়ার্ড</span>
                  <Link to="/forgot-password" title="পাসওয়ার্ড ভুলে গেছেন?" className="text-primary-600 font-medium hover:underline text-xs">ভুলে গেছেন?</Link>
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center space-x-2 disabled:opacity-70 group"
              >
                {loading ? 'প্রসেসিং...' : (
                  <>
                    <span>প্রবেশ করুন</span>
                    <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-slate-400">
                <span className="bg-white px-4">অন্যান্য অপশন</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
              <span>গুগল দিয়ে লগইন</span>
            </button>

            <p className="text-center text-sm text-slate-600 pt-2">
              অ্যাকাউন্ট নেই?{' '}
              <Link to="/register" className="text-primary-600 font-bold hover:underline">নতুন তৈরি করুন</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
