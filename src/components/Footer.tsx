import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 relative overflow-hidden pt-24 pb-12">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-50 opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-50 opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-50 blur-md opacity-30 group-hover:opacity-60 transition-opacity rounded-xl"></div>
                <div className="bg-primary-600 p-2 rounded-xl relative z-10">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 tracking-tight">
                Zunayed Academy
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              জুনায়েদ একাডেমি বাংলাদেশের শিক্ষার্থীদের জন্য একটি আধুনিক লার্নিং প্ল্যাটফর্ম। 
              আমরা SSC, HSC এবং বিভিন্ন স্কিল ডেভেলপমেন্ট কোর্স প্রদান করে থাকি।
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="bg-white border border-slate-200 p-2.5 rounded-xl hover:border-primary-100 hover:shadow-sm hover:text-primary-600 transition-all text-slate-500 group"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 tracking-wider uppercase text-sm">Courses</h3>
            <ul className="space-y-4 text-sm">
              {[
                { name: 'SSC Preparation', slug: 'academic' },
                { name: 'HSC Preparation', slug: 'academic' },
                { name: 'Skill Development', slug: 'skills' },
                { name: 'Language Learning', slug: 'language' },
                { name: 'University Admission', slug: 'admission' }
              ].map((cat, i) => (
                <li key={i}>
                  <Link 
                    to={`/courses?category=${cat.slug}`} 
                    className="text-slate-500 hover:text-primary-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 tracking-wider uppercase text-sm">Resources</h3>
            <ul className="space-y-4 text-sm">
              {[
                { name: 'Free Courses', path: '/free-courses' }, 
                { name: 'Blog & Articles', path: '/blog' }, 
                { name: 'Success Stories', path: '/success-stories' }, 
                { name: 'About Us', path: '/about' }
              ].map((item, i) => (
                <li key={i}>
                  <Link 
                    to={item.path} 
                    className="text-slate-500 hover:text-primary-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 tracking-wider uppercase text-sm">Contact Us</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-start space-x-3 group cursor-pointer">
                <Mail className="h-5 w-5 text-primary-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-slate-900 transition-colors">info@zunayedacademy.com</span>
              </li>
              <li className="flex items-start space-x-3 group cursor-pointer">
                <Phone className="h-5 w-5 text-primary-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-slate-900 transition-colors">+880 1712-345678</span>
              </li>
              <li className="flex items-start space-x-3 group">
                <MapPin className="h-5 w-5 text-slate-500 shrink-0 mt-0.5 group-hover:text-primary-600 transition-colors" />
                <span className="group-hover:text-slate-900 transition-colors">Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm font-medium">
          <p className="text-slate-500">© 2026 Zunayed Academy. All rights reserved.</p>
          <div className="flex space-x-6 text-slate-500">
            <Link to="/privacy-policy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-600 transition-colors">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-primary-600 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

