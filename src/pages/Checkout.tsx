import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function Checkout() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingCourse, setFetchingCourse] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const courseDoc = await getDoc(doc(db, 'courses', id));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingCourse(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !user || !course) return;
    
    setLoading(true);
    try {
      // Simulate real payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentData = {
        userId: user.uid,
        userName: user.displayName || user.email,
        courseId: course.id,
        courseTitle: course.title,
        amount: course.price || 999,
        method: paymentMethod,
        txId: `${paymentMethod.toUpperCase()}${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: 'completed',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'payments'), paymentData);
      
      // Also create an enrollment record
      await addDoc(collection(db, 'enrollments'), {
        userId: user.uid,
        courseId: course.id,
        enrolledAt: serverTimestamp(),
        progress: 0,
        status: 'active'
      });

      setSuccess(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'payments');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (success) {
      return (
          <div className="max-w-3xl mx-auto px-4 py-12 md:py-24 text-center relative z-10">
              <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-emerald-400/10 blur-[120px] rounded-full animate-pulse"></div>
              </div>
              <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden"
              >
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/5 to-transparent pointer-events-none"></div>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-sm relative z-10">
                      <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" />
                  </div>
                  <h1 className="text-2xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 mb-4 relative z-10 tracking-tight">পেমেন্ট সফল হয়েছে!</h1>
                  <p className="text-slate-500 mb-8 max-w-sm md:max-w-md mx-auto text-sm md:text-lg relative z-10 font-bold">
                      আপনাকে কোর্সে স্বাগতম। আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে এবং আপনি এখন কোর্সটি শুরু করতে পারেন।
                  </p>
                  <Link to="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center px-8 md:px-10 py-3.5 md:py-4 bg-slate-900 border border-slate-800 text-white font-black rounded-xl md:rounded-2xl hover:shadow-xl transition-all group relative z-10 overflow-hidden active:scale-95">
                      <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
                      <span className="relative z-10 flex items-center">ড্যাশবোর্ডে যান <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                  </Link>
              </motion.div>
          </div>
      );
  }

  return (
    <div className="bg-slate-50 min-h-screen relative pt-28 pb-12">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-primary-50 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[40%] bg-primary-50 blur-[150px] rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">চেকআউট</h1>
          <p className="text-slate-500 mt-2 text-lg font-bold">আপনার পেমেন্ট সম্পন্ন করে কোর্সটি শুরু করুন</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Order Summary - Top on Mobile, Right on Desktop */}
          <div className="lg:col-span-4 lg:order-2">
             <OrderSummary course={course} />
          </div>

          {/* Left Side: Order Details & Payment Methods */}
          <div className="lg:col-span-8 lg:order-1 space-y-8">
            
             <div className="bg-white  p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-50 transition-colors"></div>
               
               <h2 className="text-lg md:text-xl font-black text-slate-900 mb-6 md:mb-8 flex items-center relative z-10 tracking-tight">
                   <CreditCard className="mr-3 text-primary-600" /> পেমেন্ট মেথড নির্বাচন করুন
               </h2>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10 relative z-10">
                  {['bkash', 'nagad', 'rocket', 'card'].map((method) => (
                      <button 
                         key={method}
                         type="button"
                         onClick={() => setPaymentMethod(method)}
                         className={`p-4 md:p-5 border-2 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 ${
                             paymentMethod === method ? 'border-primary-600 bg-primary-50/30' : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                         }`}
                      >
                          <div className={`font-black uppercase tracking-widest text-[10px] md:text-xs transition-colors ${paymentMethod === method ? 'text-primary-600' : 'text-slate-400'}`}>{method}</div>
                      </button>
                  ))}
               </div>

               <form onSubmit={handleCheckout} className="space-y-6 relative z-10">
                   {paymentMethod !== 'card' && (
                       <div className="space-y-4">
                          <div>
                              <label className="block text-xs md:text-sm font-black text-slate-600 mb-2">
                                  আপনার {paymentMethod.toUpperCase()} একাউন্ট নাম্বার
                              </label>
                              <div className="relative group/input">
                                <div className="absolute -inset-0.5 bg-primary-600 rounded-xl md:rounded-2xl blur opacity-0 group-focus-within/input:opacity-10 transition duration-500"></div>
                                <input 
                                    type="text"
                                    placeholder="01XXXXXXXXX"
                                    required
                                    className="relative w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary-600/50 text-slate-900 placeholder-slate-400 font-bold transition-all text-sm md:text-base shadow-inner"
                                />
                              </div>
                          </div>
                       </div>
                   )}

                   {paymentMethod === 'card' && (
                       <div className="space-y-4">
                          <div className="p-4 md:p-6 bg-slate-900 text-white rounded-xl md:rounded-2xl text-xs md:text-sm border border-slate-800 flex items-start shadow-xl">
                              <ShieldCheck className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-primary-400" />
                              <p className="font-bold leading-relaxed">আমরা নিরাপদ SSL কমার্স গেটওয়ে ব্যবহার করি। আপনার কার্ডের তথ্য আমাদের কাছে সেভ থাকে না।</p>
                          </div>
                       </div>
                   )}
                   
                   <div className="pt-6 md:pt-8 border-t border-slate-100">
                       <label className="flex items-start cursor-pointer group">
                          <div className="flex items-center h-6">
                              <input 
                                  type="checkbox" 
                                  required
                                  checked={agreed}
                                  onChange={(e) => setAgreed(e.target.checked)}
                                  className="w-5 h-5 border-slate-200 rounded-lg bg-slate-50 text-primary-600 focus:ring-primary-600 focus:ring-offset-white mt-1"
                              />
                          </div>
                          <div className="ml-4 text-xs md:text-sm font-bold text-slate-500">
                              আমি <Link to="/terms" className="text-primary-600 font-black hover:underline underline-offset-4">শর্তাবলী</Link> এবং <Link to="/privacy-policy" className="text-primary-600 font-black hover:underline underline-offset-4">প্রাইভেসি পলিসি</Link> এর সাথে একমত।
                          </div>
                       </label>
                   </div>

                   <button 
                     type="submit"
                     disabled={!agreed || loading}
                     className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg flex justify-center items-center transition-all duration-300 relative overflow-hidden group/btn mt-4 shadow-sm active:scale-[0.98] ${
                         agreed && !loading ? 'bg-primary-600 text-white hover:shadow-xl' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                     }`}
                   >
                       {agreed && !loading && <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out pointer-events-none"></div>}
                       <span className="relative z-10 flex items-center">
                         {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Lock className="w-5 h-5 mr-2" />}
                         {loading ? 'প্রসেসিং হচ্ছে...' : `পেমেন্ট সম্পন্ন করুন ৳${course?.price || 999}`}
                       </span>
                   </button>
               </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ course }: { course: any }) {
    if (!course) return null;

    return (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 lg:sticky lg:top-28 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary-50 rounded-full blur-[60px] pointer-events-none"></div>
            <h3 className="font-black text-lg md:text-xl text-slate-900 mb-6 md:mb-8 relative z-10 tracking-tight">অর্ডার সামারি</h3>
            <div className="flex gap-4 mb-6 md:mb-8 border-b border-slate-100 pb-6 md:pb-8 relative z-10">
                <div className="p-1 rounded-lg md:rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden w-20 h-14 md:w-24 md:h-16">
                  <img src={course.thumbnail} alt="" className="w-full h-full object-cover rounded-md md:rounded-lg" />
                </div>
                <div>
                   <h4 className="font-black text-slate-900 leading-tight mb-1 line-clamp-2 text-xs md:text-sm tracking-tight">{course.title}</h4>
                   <div className="text-[10px] md:text-xs font-black text-primary-600 uppercase tracking-widest">{course.instructorName || 'Zunayed Ahmed'}</div>
                </div>
            </div>

            <div className="space-y-3 md:space-y-4 text-xs md:text-sm mb-6 md:mb-8 pb-6 md:pb-8 border-b border-slate-100 relative z-10 font-bold">
                <div className="flex justify-between text-slate-500">
                    <span>কোর্স মূল্য</span>
                    <span className="font-sans">৳{course.price + 500}</span>
                </div>
                <div className="flex justify-between text-emerald-500">
                    <span>বিশেষ ডিসকাউন্ট</span>
                    <span className="font-sans">-৳৫০০</span>
                </div>
            </div>

            <div className="flex justify-between items-center font-black text-xl md:text-2xl text-slate-900 mb-6 md:mb-8 relative z-10 tracking-tighter">
                <span>সর্বমোট</span>
                <span className="font-sans text-primary-600">৳{course.price}</span>
            </div>
            
            <div className="flex items-start gap-4 bg-slate-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-100 relative z-10">
               <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary-600 shrink-0 mt-0.5" />
               <p className="text-[10px] md:text-[11px] text-slate-400 leading-relaxed font-bold">
                   আপনার লেনদেন সম্পূর্ণ নিরাপদ। আমরা উন্নত 256-bit এনক্রিপশন ব্যবহার করে থাকি এবং কোনো তথ্য আমাদের সার্ভারে সংরক্ষণ করি না। 
               </p>
            </div>
        </div>
    );
}
