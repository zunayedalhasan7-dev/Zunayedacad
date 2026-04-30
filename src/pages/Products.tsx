import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, Filter, Star, ArrowRight, Package, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (productsData.length > 0) {
          setProducts(productsData);
        } else {
          // Fallback to static data if Firestore is empty
          setProducts([
            { id: 'p1', title: 'প্রিমিয়াম স্টাডি কিট', price: 1500, rating: 4.8, image: 'https://images.unsplash.com/photo-1544816153-0975b779a6cd?w=500', category: 'Essential', desc: 'SSC ও HSC শিক্ষার্থীদের জন্য একটি সম্পূর্ণ স্টাডি প্যাক।' },
            { id: 'p2', title: 'স্মার্ট ক্যালকুলেটর (Fx-991ES Plus)', price: 1200, rating: 4.9, image: 'https://images.unsplash.com/photo-1574607383476-f517f220d1c0?w=500', category: 'Tools', desc: 'অ্যাডভান্সড ম্যাথমেটিক্স ক্যালকুলেশন করার জন্য পারফেক্ট।' },
            { id: 'p3', title: 'একাডেমিক নোটবুক সেট', price: 450, rating: 4.7, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500', category: 'Stationery', desc: '৫টি প্রিমিয়াম কোয়ালিটির নোটবুক প্যাক।' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full mb-4"
            >
              <Package className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">একাডেমি শপ</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
            >
              প্রয়োজনীয় <span className="text-primary-600">পণ্যসমূহ</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 mt-4 text-lg max-w-2xl"
            >
              শিক্ষার্থীদের মানসম্মত শিক্ষা ও প্রস্তুতির জন্য বাছাইকৃত সকল লার্নিং এক্সেসরিজ।
            </motion.p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
              <input
                type="text"
                placeholder="পণ্য খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 shadow-sm"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
              <Filter className="w-5 h-5" /> ফিল্টার
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-primary-100 hover:shadow-sm transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-slate-200 uppercase tracking-widest">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{product.rating}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                  {product.desc}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <span className="text-2xl font-bold text-slate-900">৳{product.price}</span>
                  <button className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-colors shadow-sm">
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
