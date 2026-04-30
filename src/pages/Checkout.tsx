import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) {
       setSuccess(true);
    }
  };

  if (success) {
      return (
          <div className="max-w-3xl mx-auto px-4 py-24 text-center relative z-10">
              <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-emerald-400/10 blur-[120px] rounded-full animate-pulse"></div>
              </div>
              <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="bg-white  p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden"
              >
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/5 to-transparent pointer-events-none"></div>
                  <div className="w-24 h-24 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm relative z-10">
                      <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200 mb-4 relative z-10">পেমেন্ট সফল হয়েছে!</h1>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg relative z-10">
                      আপনাকে কোর্সে স্বাগতম। আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে এবং আপনি এখন কোর্সটি শুরু করতে পারেন।
                  </p>
                  <Link to="/dashboard" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-900 font-bold rounded-2xl hover:shadow-sm transition-all group relative z-10 overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
                      <span className="relative z-10 flex items-center">ড্যাশবোর্ডে যান <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                  </Link>
              </motion.div>
          </div>
      );
  }

  return (
    <div className="bg-slate-50 min-h-screen relative pt-20 pb-12">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-primary-50 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[40%] bg-primary-50 blur-[150px] rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-bengali">চেকআউট</h1>
          <p className="text-slate-500 mt-2 text-lg">আপনার পেমেন্ট সম্পন্ন করে কোর্সটি শুরু করুন</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Order Details & Payment Methods */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Order Summary Mobile-only */}
            <div className="block lg:hidden">
                <OrderSummary />
            </div>

             <div className="bg-white  p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-50 transition-colors"></div>
               
               <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center relative z-10">
                   <CreditCard className="mr-3 text-primary-600" /> পেমেন্ট মেথড নির্বাচন করুন
               </h2>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
                  {['bkash', 'nagad', 'rocket', 'card'].map((method) => (
                      <button 
                         key={method}
                         onClick={() => setPaymentMethod(method)}
                         className={`p-4 border-2 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                             paymentMethod === method ? 'border-primary-100 bg-primary-50 shadow-sm' : 'border-slate-200 hover:border-primary-100 bg-slate-50 hover:bg-slate-50'
                         }`}
                      >
                          <div className={`font-bold uppercase tracking-wider transition-colors ${paymentMethod === method ? 'text-primary-600' : 'text-slate-500'}`}>{method}</div>
                      </button>
                  ))}
               </div>

               <form onSubmit={handleCheckout} className="space-y-6 relative z-10">
                   {paymentMethod !== 'card' && (
                       <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-bold text-slate-600 mb-2">
                                  আপনার {paymentMethod.toUpperCase()} একাউন্ট নাম্বার
                              </label>
                              <div className="relative group/input">
                                <div className="absolute -inset-0.5 bg-primary-600 rounded-2xl blur opacity-0 group-focus-within/input:opacity-20 transition duration-500"></div>
                                <input 
                                    type="text"
                                    placeholder="01XXXXXXXXX"
                                    required
                                    className="relative w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary-100 text-slate-900 placeholder-slate-600 transition-all text-sm"
                                />
                              </div>
                          </div>
                       </div>
                   )}

                   {paymentMethod === 'card' && (
                       <div className="space-y-4">
                          <div className="p-5 bg-amber-400/10 text-amber-200 rounded-2xl text-sm border border-amber-400/20 flex items-start shadow-inner">
                              <ShieldCheck className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-amber-400" />
                              <p className="leading-relaxed">আমরা নিরাপদ SSL কমার্স গেটওয়ে ব্যবহার করি। আপনার কার্ডের তথ্য আমাদের কাছে সেভ থাকে না।</p>
                          </div>
                       </div>
                   )}
                   
                   <div className="pt-8 border-t border-slate-200">
                       <label className="flex items-start cursor-pointer group">
                          <div className="flex items-center h-6">
                              <input 
                                  type="checkbox" 
                                  required
                                  checked={agreed}
                                  onChange={(e) => setAgreed(e.target.checked)}
                                  className="w-5 h-5 border-slate-200 rounded bg-slate-50 text-primary-600 focus:ring-primary-600 focus:ring-offset-white mt-0.5"
                              />
                          </div>
                          <div className="ml-3 text-sm">
                              <span className="text-slate-500">
                                  আমি <Link to="/terms" className="text-primary-600 font-bold hover:underline">শর্তাবলী</Link> এবং <Link to="/privacy-policy" className="text-primary-600 font-bold hover:underline">প্রাইভেসি পলিসি</Link> এর সাথে একমত।
                              </span>
                          </div>
                       </label>
                   </div>

                   <button 
                     type="submit"
                     disabled={!agreed}
                     className={`w-full py-4 rounded-2xl font-bold text-lg flex justify-center items-center transition-all duration-300 relative overflow-hidden group/btn mt-4 ${
                         agreed ? 'bg-primary-600 text-white hover:shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-500 cursor-not-allowed'
                     }`}
                   >
                       {agreed && <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out pointer-events-none"></div>}
                       <span className="relative z-10 flex items-center">
                         <Lock className="w-5 h-5 mr-2" /> পেমেন্ট সম্পন্ন করুন ৳৯৯৯
                       </span>
                   </button>
               </form>
             </div>
          </div>

          {/* Right Side: Order Summary (Desktop) */}
          <div className="hidden lg:block lg:col-span-4">
             <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary() {
    return (
        <div className="bg-white  p-8 rounded-3xl border border-slate-200 sticky top-28 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary-50 rounded-full blur-[60px] pointer-events-none"></div>
            <h3 className="font-bold text-xl text-slate-900 mb-8 relative z-10">অর্ডার সামারি</h3>
            <div className="flex gap-4 mb-8 border-b border-slate-200 pb-8 relative z-10">
                <div className="p-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent shrink-0">
                  <img src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=200&auto=format&fit=crop&q=60" alt="" className="w-24 h-16 object-cover rounded-lg" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-900 leading-tight mb-2 line-clamp-2">SSC Math Special Batch</h4>
                   <div className="text-sm font-medium text-primary-600">জুনায়েদ আহমেদ</div>
                </div>
            </div>

            <div className="space-y-4 text-sm mb-8 pb-8 border-b border-slate-200 relative z-10">
                <div className="flex justify-between text-slate-500">
                    <span>মূল্য</span>
                    <span className="font-sans">৳১৫০০</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium">
                    <span>ডিসকাউন্ট</span>
                    <span className="font-sans">-৳৫০১</span>
                </div>
            </div>

            <div className="flex justify-between items-center font-bold text-2xl text-slate-900 mb-8 relative z-10">
                <span>সর্বমোট</span>
                <span className="font-sans text-primary-600">৳৯৯৯</span>
            </div>
            
            <div className="flex items-start gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 relative z-10 group-hover:border-slate-200 transition-colors">
               <ShieldCheck className="w-6 h-6 text-primary-600 shrink-0" />
               <p className="text-xs text-slate-500 leading-relaxed">
                   আপনার লেনদেন সম্পূর্ণ নিরাপদ। আমরা উন্নত 256-bit এনক্রিপশন ব্যবহার করে থাকি। 
               </p>
            </div>
        </div>
    );
}
