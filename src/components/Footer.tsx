import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import FooterBackground from './FooterBackground';

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-400 pt-24 pb-12 overflow-hidden border-t border-slate-900" id="main-footer">
      <FooterBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-2xl shadow-lg shadow-primary-900/20">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Zunayed Academy
              </span>
            </Link>
            <p className="text-base leading-relaxed text-slate-400">
              জুনায়েদ একাডেমি বাংলাদেশের শিক্ষার্থীদের জন্য একটি আধুনিক লার্নিং প্ল্যাটফর্ম। 
              আমরা SSC, HSC এবং বিভিন্ন স্কিল ডেভেলপমেন্ট কোর্স প্রদান করে থাকি।
            </p>
            <div className="flex space-x-5">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <motion.a 
                  key={i}
                  href="#" 
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="bg-white/5 p-3 rounded-xl hover:bg-primary-600 hover:text-white transition-all text-slate-400"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-bold text-lg mb-8 tracking-wide">কুইক লিঙ্কস</h3>
            <ul className="space-y-5 text-base">
              {['সকল কোর্স', 'ফ্রি কোর্সসমূহ', 'আমাদের শিক্ষকগণ', 'আমাদের সম্পর্কে'].map((item, i) => (
                <li key={i}>
                  <Link 
                    to={i === 0 ? "/courses" : i === 1 ? "/free-courses" : "/"} 
                    className="hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 mr-0 group-hover:mr-2 transition-all"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-bold text-lg mb-8 tracking-wide">ক্যাটাগরি</h3>
            <ul className="space-y-5 text-base">
              {[
                { name: 'SSC প্রিপারেশন', slug: 'SSC' },
                { name: 'HSC প্রিপারেশন', slug: 'HSC' },
                { name: 'স্কিল ডেভেলপমেন্ট', slug: 'Skills' },
                { name: 'ফ্রিল্যান্সিং', slug: 'Freelancing' }
              ].map((cat, i) => (
                <li key={i}>
                  <Link 
                    to={`/courses?category=${cat.slug}`} 
                    className="hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 mr-0 group-hover:mr-2 transition-all"></span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-bold text-lg mb-8 tracking-wide">যোগাযোগ</h3>
            <ul className="space-y-6 text-base">
              <li className="flex items-center space-x-4 group cursor-pointer">
                <div className="bg-white/5 p-3 rounded-xl group-hover:bg-primary-600/20 transition-colors">
                  <Mail className="h-5 w-5 text-primary-500" />
                </div>
                <span className="group-hover:text-white transition-colors">info@zunayedacademy.com</span>
              </li>
              <li className="flex items-center space-x-4 group cursor-pointer">
                <div className="bg-white/5 p-3 rounded-xl group-hover:bg-primary-600/20 transition-colors">
                  <Phone className="h-5 w-5 text-primary-500" />
                </div>
                <span className="group-hover:text-white transition-colors font-mono tracking-wider">+৮৮০ ১৭১২-৩৪৫৬৭৮</span>
              </li>
              <li className="flex items-center space-x-4 group cursor-pointer">
                <div className="bg-white/5 p-3 rounded-xl group-hover:bg-primary-600/20 transition-colors">
                  <MapPin className="h-5 w-5 text-primary-500" />
                </div>
                <span className="group-hover:text-white transition-colors">ঢাকা, বাংলাদেশ</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-sm font-medium tracking-wide">
          <p>© ২০২৬ জুনায়েদ একাডেমি। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex space-x-8 text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

