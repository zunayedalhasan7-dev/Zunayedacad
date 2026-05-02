import React from 'react';
import { motion } from 'motion/react';
import { Star, Users, BookOpen, Award } from 'lucide-react';

export default function Instructors() {
  const instructors = [
    {
      id: 1,
      name: 'মোঃ সাইফুর রহমান',
      role: 'গণিত ও উচ্চতর গণিত নির্দেশক',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
      students: '৫০০০+',
      rating: 4.9,
      courses: 12,
      bio: 'বুয়েট (CSE) থেকে স্নাতক সম্পন্ন করেছেন। বিগত ৫ বছর ধরে গণিত এবং ফিজিক্সের উপর মেন্টরশিপ করে আসছেন শত শত শিক্ষার্থীকে।',
      expertise: ['গণিত', 'উচ্চতর গণিত', 'পদার্থবিজ্ঞান']
    },
    {
      id: 2,
      name: 'ড. ফারজানা হক',
      role: 'জীববিজ্ঞান বিশেষজ্ঞ',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      students: '৩০০০+',
      rating: 4.8,
      courses: 8,
      bio: 'ঢাকা মেডিকেল কলেজ থেকে এমবিবিএস সম্পন্ন করেছেন। মেডিকেল ভর্তিচ্ছুদের জন্য তিনি একজন সমাদৃত নাম। তার পাঠদান পদ্ধতি অত্যন্ত সহজবোধ্য।',
      expertise: ['জীববিজ্ঞান', 'মেডিকেল ভর্তি প্রস্তুতি']
    },
    {
      id: 3,
      name: 'তানভীর আহমেদ',
      role: 'ইংরেজি নির্দেশক',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      students: '৮০০০+',
      rating: 4.9,
      courses: 15,
      bio: 'ঢাকা বিশ্ববিদ্যালয় থেকে ইংরেজিতে মাস্টার্স। স্পোকেন এবং গ্রামারে তার রয়েছে বিশেষ দক্ষতা। আইইএলটিএস ট্রেইনার হিসেবেও কাজ করছেন।',
      expertise: ['ইংরেজি ব্যাকরণ', 'স্পোকেন ইংলিশ', 'IELTS']
    },
    {
      id: 4,
      name: 'আহসানুল কবীর',
      role: 'আইসিটি ও স্কিল ডেভেলপমেন্ট',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      students: '১০০০০+',
      rating: 5.0,
      courses: 20,
      bio: 'ফ্রিল্যান্সিং এবং স্কিল ডেভেলপমেন্টের জগতে পরিচিত মুখ। তার ওয়েব ডেভেলপমেন্ট এবং গ্রাফিক্স ডিজাইনের কোর্সগুলো দেশজুড়ে জনপ্রিয়।',
      expertise: ['আইসিটি', 'ওয়েব ডেভেলপমেন্ট', 'ফ্রিল্যান্সিং']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Header Section */}
      <div className="bg-primary-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-primary-800/50 blur-3xl mix-blend-multiply"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-indigo-900/40 blur-3xl mix-blend-multiply"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            আমাদের দক্ষ <span className="text-amber-400">ইন্সট্রাক্টরবৃন্দ</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto font-medium"
          >
            দেশের সেরা বিশ্ববিদ্যালয়গুলোর মেধাবী শিক্ষার্থী এবং অভিজ্ঞ শিক্ষকদের নিয়ে তৈরি আমাদের প্যানেল, যারা আপনার স্বপ্ন পূরণে বদ্ধপরিকর।
          </motion.p>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor, idx) => (
            <motion.div
              key={instructor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img 
                  src={instructor.image} 
                  alt={instructor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{instructor.name}</h3>
                  <p className="text-primary-200 text-sm font-medium">{instructor.role}</p>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-700 font-bold mb-1">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      {instructor.rating}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">রেটিং</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-700 font-bold mb-1">
                      <Users className="w-4 h-4 text-primary-500" />
                      {instructor.students}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">শিক্ষার্থী</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-700 font-bold mb-1">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      {instructor.courses}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">কোর্স</div>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                  {instructor.bio}
                </p>

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {instructor.expertise.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">কেন আমাদের ইন্সট্রাক্টরদের বেছে নিবেন?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">আমাদের ইন্সট্রাক্টরগণ শুধুমাত্র শিক্ষকই নন, তারা এক একজন মেন্টর। শিক্ষার্থীর প্রতিটি সমস্যার সমাধানে তারা সদা প্রস্তুত।</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">শীর্ষস্থান অধিকারী</h3>
              <p className="text-slate-600 text-sm">বাংলাদেশের শীর্ষস্থানীয় বিশ্ববিদ্যালয় এবং মেডিকেল কলেজ থেকে আগত মেধাবী মুখ।</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">৫ বছরের অধিক অভিজ্ঞতা</h3>
              <p className="text-slate-600 text-sm">শিক্ষা প্রদানে ৫ বছরেরও বেশি অভিজ্ঞতা যা শিক্ষার্থীদের আস্থা এনে দেয়।</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">২৪/৭ সাপোর্ট</h3>
              <p className="text-slate-600 text-sm">যে কোন কোর্সে শিক্ষার্থীদের ডাউট সলভ করার জন্য ২৪/৭ সাপোর্ট ব্যবস্থা।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
