import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'কীভাবে এইচএসসি পরীক্ষায় এ+ নিশ্চিত করবেন? ৫টি কার্যকরী টিপস',
      excerpt: 'এইচএসসি পরীক্ষা জীবনের অন্যতম গুরুত্বপূর্ণ একটি ধাপ। সঠিক পরিকল্পনা এবং রুটিন মেনে চললে এ+ পাওয়া মোটেও কঠিন কিছু নয়।',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60',
      category: 'Education',
      date: 'Oct 15, 2026',
      author: 'Zunayed Ahmed'
    },
    {
      id: 2,
      title: 'ফ্রিল্যান্সিং ক্যারিয়ার কীভাবে শুরু করবেন?',
      excerpt: 'বর্তমান সময়ে ফ্রিল্যান্সিং একটি জনপ্রিয় ক্যারিয়ার। কিন্তু অনেকেই বুঝতে পারেন না ঠিক কোথা থেকে এবং কীভাবে শুরু করতে হবে।',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      category: 'Career',
      date: 'Oct 12, 2026',
      author: 'Tanjil Hasan'
    },
    {
      id: 3,
      title: 'ইংরেজি স্পোকেন স্কিল বাড়ানোর সহজ উপায়',
      excerpt: 'অনেকেই ভালো ইংরেজি জানলেও কথা বলার সময় আটকে যান। আজকের ব্লগে আমরা জানবো স্পোকেন ইংলিশের ভয় দূর করার উপায়।',
      image: 'https://images.unsplash.com/photo-1546410531-bea4efa5adbc?w=800&auto=format&fit=crop&q=60',
      category: 'Skill',
      date: 'Oct 08, 2026',
      author: 'Tamanna Fahmi'
    },
    {
      id: 4,
      title: 'বিশ্ববিদ্যালয় ভর্তি পরীক্ষার চূড়ান্ত প্রস্তুতি',
      excerpt: 'বিশ্ববিদ্যালয় ভর্তি পরীক্ষা সন্নিকটে। শেষ মুহূর্তের প্রস্তুতি কেমন হওয়া উচিত সে বিষয়ে গাইডলাইন দিয়েছেন ঢাকা বিশ্ববিদ্যালয়ের শিক্ষার্থীরা।',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60',
      category: 'Admission',
      date: 'Oct 01, 2026',
      author: 'Zunayed Ahmed'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-24 relative overflow-hidden font-sans">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary-50 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-primary-50 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary-50 blur-[50px] rounded-full pointer-events-none"></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-bengali text-slate-900 mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-500 to-indigo-600 drop-shadow-sm relative z-10">আমাদের ব্লগ</h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium relative z-10">শিক্ষামূলক আর্টিকেল, স্টাডি টিপস, ক্যারিয়ার গাইডলাইন এবং আরও অনেক কিছু পড়ুন।</p>
        </div>

        {/* Featured Post (First one) */}
        <div className="mb-20">
          <Link to={`/blog/${posts[0].id}`} className="block group">
             <div className="bg-white  rounded-[3rem] overflow-hidden shadow-sm hover:shadow-sm transition-all duration-500 border border-slate-200 flex flex-col lg:flex-row relative group bg-gradient-to-br hover:from-slate-100/90 hover:to-slate-100">
                <div className="lg:w-3/5 relative overflow-hidden h-72 lg:h-auto shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 z-10"></div>
                   <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute top-6 left-6 bg-primary-50  border border-primary-100 text-primary-600 text-xs font-bold px-4 py-2 rounded-xl shadow-sm z-20 uppercase tracking-widest">
                      {posts[0].category}
                   </div>
                </div>
                <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center relative z-20">
                   <div className="flex items-center text-sm text-slate-500 font-bold mb-6 space-x-5 font-sans">
                      <span className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"><Calendar className="w-4 h-4 mr-2 text-primary-600" /> {posts[0].date}</span>
                      <span className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"><User className="w-4 h-4 mr-2 text-primary-600" /> {posts[0].author}</span>
                   </div>
                   <h2 className="text-3xl lg:text-4xl font-bold font-bengali text-slate-900 mb-6 group-hover:text-primary-600 transition-colors leading-tight line-clamp-3">{posts[0].title}</h2>
                   <p className="text-slate-600 text-lg mb-8 leading-relaxed line-clamp-3">{posts[0].excerpt}</p>
                   <div className="flex items-center text-primary-600 font-bold group-hover:translate-x-2 transition-transform w-fit text-lg">
                      Read Article <ArrowRight className="ml-2 w-6 h-6" />
                   </div>
                </div>
             </div>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {posts.slice(1).map((post, i) => (
             <motion.div 
               key={post.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="h-full"
             >
               <Link to={`/blog/${post.id}`} className="block h-full group bg-white  rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-sm hover:border-slate-200 transition-all duration-500 flex flex-col bg-gradient-to-br hover:from-slate-100/90 hover:to-slate-100">
                  <div className="relative h-64 overflow-hidden shrink-0 border-b border-slate-200">
                     <div className="absolute inset-0 bg-slate-50 group-hover:bg-primary-50 transition-colors z-10"></div>
                     <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-5 left-5 bg-slate-50  border border-slate-200 text-slate-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm z-20 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
                      {post.category}
                     </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow relative z-20">
                     <div className="flex items-center text-xs text-slate-500 font-bold mb-5 space-x-4">
                        <span className="flex items-center font-sans"><Calendar className="w-4 h-4 mr-1.5 text-primary-600" /> {post.date}</span>
                     </div>
                     <h3 className="text-xl font-bold font-bengali text-slate-900 mb-4 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                       {post.title}
                     </h3>
                     <p className="text-slate-500 text-[15px] leading-relaxed mb-8 line-clamp-2 flex-grow">{post.excerpt}</p>
                     
                     <div className="flex items-center justify-between pt-5 border-t border-slate-200 mt-auto">
                        <div className="flex items-center text-sm font-bold text-slate-600">
                           <div className="w-8 h-8 bg-gradient-to-tr from-primary-600/20 to-indigo-600/20 border border-slate-200 rounded-full flex items-center justify-center text-slate-900 font-sans mr-3">
                             {post.author[0]}
                           </div>
                           {post.author}
                        </div>
                     </div>
                  </div>
               </Link>
              </motion.div>
           ))}
        </div>

      </div>
    </div>
  );
}
