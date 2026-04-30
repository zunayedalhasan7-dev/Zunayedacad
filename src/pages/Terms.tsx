import React from 'react';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="bg-slate-50 min-h-screen py-24 relative overflow-hidden font-sans">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-indigo-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="inline-flex items-center justify-center p-4 bg-white  border border-slate-200 rounded-[2rem] shadow-sm mb-8 relative z-10">
            <FileText className="w-12 h-12 text-indigo-600 drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-bengali text-slate-900 mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-400 relative z-10">Terms of Service</h1>
          <p className="text-slate-500 font-medium relative z-10">Last updated: April 30, 2026</p>
        </div>

        <div className="bg-white  rounded-[3rem] p-8 md:p-14 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-headings:font-bengali prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-p:text-slate-600 prose-li:text-slate-600 relative z-10">
            <p>
              These Terms of Service ("Terms") govern your access to and use of the Zunayed Academy website, mobile applications, and online educational services (collectively, the "Services"). Please read these Terms carefully before using the Services.
            </p>

            <h2 className="text-indigo-600 border-b border-slate-200 pb-4 mt-12 mb-6">1. Acceptance of Terms</h2>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use the Services.
            </p>

            <h2 className="text-indigo-600 border-b border-slate-200 pb-4 mt-12 mb-6">2. User Accounts</h2>
            <p>
              To access certain features of the Services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2 className="text-indigo-600 border-b border-slate-200 pb-4 mt-12 mb-6">3. Course Access and Content</h2>
            <p>
              When you enroll in a course, you get a license from us to view it via the Zunayed Academy platform, and no other use. You may not transfer or resell courses in any way.
            </p>
            <ul className="space-y-3">
              <li><strong className="text-slate-900">Lifetime Access:</strong> We generally grant you a lifetime access license, except when we must disable the course because of legal or policy reasons.</li>
              <li><strong className="text-slate-900">Copyright:</strong> All course materials, videos, and PDFs are the intellectual property of Zunayed Academy and its instructors. Unauthorized distribution or piracy is strictly prohibited.</li>
            </ul>

            <h2 className="text-indigo-600 border-b border-slate-200 pb-4 mt-12 mb-6">4. User Conduct</h2>
            <p>
              You agree not to use the Services to:
            </p>
            <ul className="space-y-3 mt-4">
              <li>Violate any local, state, national, or international law or regulation.</li>
              <li>Transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
              <li>Interfere with or disrupt the Services or servers or networks connected to the Services.</li>
            </ul>

            <h2 className="text-indigo-600 border-b border-slate-200 pb-4 mt-12 mb-6">5. Modifications to the Services</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, the Services (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Services.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
