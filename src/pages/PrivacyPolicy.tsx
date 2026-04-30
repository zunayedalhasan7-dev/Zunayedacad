import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-slate-50 min-h-screen py-24 relative overflow-hidden font-sans">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-primary-50 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary-50 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="inline-flex items-center justify-center p-4 bg-white  border border-slate-200 rounded-[2rem] shadow-sm mb-8 relative z-10">
            <Shield className="w-12 h-12 text-primary-600 drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-bengali text-slate-900 mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary-600 relative z-10">Privacy Policy</h1>
          <p className="text-slate-500 font-medium relative z-10">Last updated: April 30, 2026</p>
        </div>

        <div className="bg-white  rounded-[3rem] p-8 md:p-14 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 to-transparent pointer-events-none"></div>
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-headings:font-bengali prose-a:text-primary-600 hover:prose-a:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 relative z-10">
            <p>
              Welcome to Zunayed Academy. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="text-primary-600 border-b border-slate-200 pb-4 mt-12 mb-6">1. Important information and who we are</h2>
            <p>
              Zunayed Academy is the controller and responsible for your personal data (collectively referred to as "Company", "we", "us" or "our" in this privacy policy).
            </p>

            <h2 className="text-primary-600 border-b border-slate-200 pb-4 mt-12 mb-6">2. The data we collect about you</h2>
            <p>
              Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
            </p>
            <ul className="space-y-3">
              <li><strong className="text-slate-900">Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong className="text-slate-900">Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong className="text-slate-900">Financial Data</strong> includes payment card details (processed securely via our payment gateways, not stored directly on our servers).</li>
              <li><strong className="text-slate-900">Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              <li><strong className="text-slate-900">Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, etc.</li>
            </ul>

            <h2 className="text-primary-600 border-b border-slate-200 pb-4 mt-12 mb-6">3. How is your personal data collected?</h2>
            <p>
              We use different methods to collect data from and about you including through:
            </p>
            <ul className="space-y-3">
              <li><strong className="text-slate-900">Direct interactions.</strong> You may give us your Identity, Contact and Financial Data by filling in forms or by corresponding with us by post, phone, email or otherwise. This includes personal data you provide when you:
                <ul className="mt-2 space-y-2 text-slate-500">
                  <li>apply for our products or services;</li>
                  <li>create an account on our website;</li>
                  <li>subscribe to our service or publications;</li>
                </ul>
              </li>
            </ul>

            <h2 className="text-primary-600 border-b border-slate-200 pb-4 mt-12 mb-6">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <h2 className="text-slate-900 mt-0 mb-4">Contact Us</h2>
              <p className="mb-0">
                If you have any questions about this privacy policy or our privacy practices, please contact us at:<br/>
                <strong className="text-primary-600">Email:</strong> privacy@zunayedacademy.com<br/>
                <strong className="text-primary-600">Phone:</strong> +880 1712-345678
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
