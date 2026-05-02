import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Star, Package, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        
        let productData = null;
        
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          productData = { id: docSnap.id, ...docSnap.data() };
        }

        if (productData) {
          setProduct(productData);
        } else {
          // not found
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    // Proceed to checkout logic (can navigate to a generic checkout with item id)
    navigate(`/checkout?productId=${id}&type=product`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">প্রোডাক্ট খুঁজে পাওয়া যায়নি</h2>
        <Link to="/products" className="text-primary-600 font-medium hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> শপে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> শপে ফিরে যান
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl border border-slate-200">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="inline-block bg-primary-50 text-primary-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 border border-primary-100">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-bold text-amber-700">{product.rating}</span>
                </div>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                  <Package className="w-4 h-4" /> স্টকে আছে
                </span>
              </div>

              <div className="text-3xl font-black text-slate-900 mb-8">
                ৳{product.price}
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed overflow-hidden mb-8 text-lg">
              {product.desc}
            </p>
            
            {product.features && product.features.length > 0 && (
              <div className="mb-10">
                <h3 className="font-bold text-slate-900 mb-4 text-lg">ফিচারসমূহ</h3>
                <ul className="space-y-3 text-slate-600 font-medium">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-1 rounded-full text-emerald-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <Truck className="w-5 h-5 text-indigo-500" />
                  <span>সারাদেশে হোম ডেলিভারি</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>৭ দিনের মানিব্যাক গ্যারান্টি</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all hover:shadow-lg active:scale-[0.98]"
              >
                <ShoppingBag className="w-6 h-6" /> এখনই কিনুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
