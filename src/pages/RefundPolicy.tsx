import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="bg-slate-50 min-h-screen py-24 relative overflow-hidden font-sans">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-emerald-400/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-400/20 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="inline-flex items-center justify-center p-4 bg-white  border border-slate-200 rounded-[2rem] shadow-sm mb-8 relative z-10">
            <RotateCcw className="w-12 h-12 text-emerald-600 drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-bengali text-slate-900 mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-400 relative z-10">Refund Policy</h1>
        </div>
        
        <div className="bg-white  rounded-[3rem] p-8 md:p-14 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/5 to-transparent pointer-events-none"></div>
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-headings:font-bengali prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-p:text-slate-600 prose-li:text-slate-600 relative z-10">
            <p className="text-xl text-slate-600 leading-relaxed font-medium">We want to ensure that you are 100% happy with your purchase. Our refund policy ensures a risk-free learning experience for all our students.</p>
            
            <h2 className="text-emerald-600 border-b border-slate-200 pb-4 mt-12 mb-6">7-Day Money-Back Guarantee</h2>
            <p>If you are dissatisfied with a course, we offer a 7-day money-back guarantee. Request a full refund within 7 days of purchase, no questions asked.</p>
            
            <h2 className="text-emerald-600 border-b border-slate-200 pb-4 mt-12 mb-6">Conditions for Refund</h2>
            <p>Refunds will <strong className="text-slate-900 bg-red-500/20 px-2 py-0.5 rounded text-red-400">not</strong> be processed if:</p>
            <ul className="space-y-3">
               <li>You have consumed or viewed more than 20% of the course content.</li>
               <li>You have downloaded the course materials (PDFs, Source Codes, etc.).</li>
               <li>The request is made after 7 days from the transaction date.</li>
               <li>Multiple devices were used to access the course simultaneously.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
