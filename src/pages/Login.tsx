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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden pt-20">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-primary-50 opacity-[0.05] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[40%] bg-primary-50 opacity-[0.05] blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-0 items-stretch bg-white  rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] relative z-10">
        {/* Illustration Side */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-slate-100 p-12 text-slate-900 text-center space-y-8 relative overflow-hidden border-r border-slate-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-50 rounded-full -ml-32 -mb-32 blur-[100px] animate-pulse" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary-600 opacity-20 blur-2xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80" 
              alt="Login"
              className="w-full max-w-sm h-64 object-cover rounded-2xl drop-shadow-sm border border-slate-200 relative z-10"
            />
          </motion.div>
          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">নতুন উচ্চতা জয় করুন</h2>
            <p className="text-slate-500">আপনার স্বপ্ন পূরণের যাত্রা শুরু হোক আমাদের সাথে। সেরা শিক্ষকদের টিপস এবং ট্রিকস জানুন।</p>
          </div>
        </div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 lg:p-12 flex flex-col justify-center bg-white"
        >
          <div className="text-center lg:text-left mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
              <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                <GraduationCap className="h-6 w-6 text-primary-600" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-indigo-600 transition-all">Zunayed Academy</span>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900">লগইন করুন</h2>
            <p className="text-slate-500 mt-2 text-sm">আপনার ড্যাশবোর্ডে প্রবেশের তথ্য দিন</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-medium border border-red-500/20 animate-shake shadow-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-5">
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

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1 flex justify-between">
                  <span>পাসওয়ার্ড</span>
                  <Link to="/forgot-password" title="পাসওয়ার্ড ভুলে গেছেন?" className="text-primary-600 font-medium hover:text-primary-600/80 hover:underline text-xs transition-colors">ভুলে গেছেন?</Link>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-primary-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-600 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none text-slate-900 placeholder-slate-600 transition-all text-sm group-focus-within:border-primary-100"
                      placeholder="••••••••"
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
                      <span>প্রবেশ করুন</span>
                      <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-slate-500">
                <span className="bg-white px-4 rounded-full border border-slate-200">অথবা</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-slate-50 border border-slate-200 text-slate-900 font-bold py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5 group-hover:scale-110 transition-transform" alt="Google" />
              <span>গুগল দিয়ে লগইন</span>
            </button>

            <p className="text-center text-sm text-slate-500 pt-2">
              অ্যাকাউন্ট নেই?{' '}
              <Link to="/register" className="text-primary-600 font-bold hover:text-primary-600/80 hover:underline transition-colors">নতুন তৈরি করুন</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
