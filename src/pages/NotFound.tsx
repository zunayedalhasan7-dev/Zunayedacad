import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-slate-700">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-6">পেজটি পাওয়া যায়নি!</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          আপনি যে পেজটি খুঁজছেন তা সম্ভবত মুছে ফেলা হয়েছে বা নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ।
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-sm">
            <Home className="w-5 h-5 mr-2" />
            হোমপেজে ফিরে যান
          </Link>
          <button onClick={() => window.history.back()} className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 rounded-lg font-bold border border-slate-200 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            আগের পেজে যান
          </button>
        </div>
      </div>
    </div>
  );
}
