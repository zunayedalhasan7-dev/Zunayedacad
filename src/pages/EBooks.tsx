import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Search, Download, Star, ExternalLink, Bookmark, Loader2 } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function EBooks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'ebooks'), (snapshot) => {
      const ebooksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (ebooksData.length > 0) {
        setEbooks(ebooksData);
      } else {
        setEbooks([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching ebooks:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredEBooks = ebooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full mb-6"
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">E-Library</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            আমাদের <span className="text-indigo-600">ই-বুকসমূহ</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg leading-relaxed"
          >
            সেরা মেন্টরদের দ্বারা প্রস্তুতকৃত নোট ও বইগুলো এখন আপনার হাতের মুঠোয়। পড়তে শুরু করুন আজই।
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-indigo-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="ই-বুক এর নাম দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-100 transition-all shadow-sm text-lg"
              />
            </div>
          </div>
        </div>

        {/* EBooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredEBooks.map((book, idx) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-sm hover:border-indigo-100 transition-all duration-500 group"
            >
              <div className="flex flex-col h-full">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-8">
                     <button className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        এখনই পড়ুন <ExternalLink className="w-4 h-4" />
                     </button>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{book.pages} পৃষ্ঠা</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-slate-700">{book.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">{book.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{book.desc}</p>
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">লেখক: {book.author}</p>
                      <p className="text-2xl font-bold text-slate-900">৳{book.price}</p>
                    </div>
                    <button className="p-4 bg-slate-50 rounded-2xl text-slate-900 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
