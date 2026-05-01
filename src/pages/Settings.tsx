import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Camera, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export default function Settings() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form states
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');

  // Image Upload States
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
    } else if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [profile, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      setUploadError('শুধুমাত্র ছবি আপলোড করা যাবে (jpg, png)');
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      setUploadError('ছবির সাইজ ১ মেগাবাইটের কম হতে হবে');
      return;
    }

    setUploadError(null);
    setSelectedFile(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !user) return;

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('প্রমাণীকরণ ব্যর্থ হয়েছে। আবার লগইন করুন।');

      console.log('Starting profile picture upload to /api/upload-profile...');
      const response = await fetch('/api/upload-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log('Raw server response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('সার্ভার থেকে অবৈধ রেসপন্স পাওয়া গেছে।');
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || 'আপলোড ব্যর্থ হয়েছে');
      }

      console.log('Upload successful! Photo URL:', data.photoURL);

      // Update local profile view if needed, though onSnapshot in AuthContext should handle it
      setImagePreview(null);
      setSelectedFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);
    try {
      // 1. Update Firebase Auth Profile (for displayName)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }

      // 2. Update Firestore Document
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        bio,
        phone,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 relative z-10 pb-20 px-4 sm:px-6 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-50 transition-colors"></div>
         <div className="relative z-10">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">প্রোফাইল সেটিংস</h1>
          <p className="text-slate-500 font-bold text-base md:text-lg mt-1">আপনার ব্যক্তিগত তথ্য পরিচালনা করুন</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
         <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: 'profile', label: 'ব্যক্তিগত তথ্য' },
              { id: 'password', label: 'নিরাপত্তা' },
              { id: 'notifications', label: 'নোটিফিকেশন' },
            ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-black whitespace-nowrap transition-all duration-300 ${
                   activeTab === tab.id 
                    ? 'bg-primary-600 text-white shadow-md scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                 }`}
               >
                 {tab.label}
               </button>
            ))}
         </div>

         <div className="p-6 md:p-12">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.form 
                  key="profile-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleUpdateProfile} 
                  className="space-y-10 max-w-2xl"
                >
                    {/* Avatar upload */}
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                       <div className="relative group shrink-0">
                          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 duration-300">
                             {imagePreview ? (
                                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                             ) : profile?.photoURL ? (
                                  <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                             ) : (
                                  <User className="w-10 h-10 md:w-12 md:h-12 text-slate-300" />
                             )}
                          </div>
                          <label className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-all border-2 md:border-4 border-white cursor-pointer">
                             <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                             <Camera className="w-4 h-4 md:w-5 md:h-5" />
                          </label>
                       </div>
                       <div className="text-center sm:text-left">
                          <h3 className="text-lg md:text-xl font-black text-slate-900 mb-0.5 tracking-tight">প্রোফাইল ছবি</h3>
                          <p className="text-xs md:text-sm font-bold text-slate-500 mb-3">আপনার প্রোফাইল ছবি আপডেট করুন</p>
                          
                          <div className="flex items-center gap-3">
                            <label className="px-5 py-2 md:py-2.5 text-[10px] md:text-xs font-black border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
                               ছবি বাছুন
                               <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                            
                            {selectedFile && (
                              <button 
                                type="button"
                                onClick={handleImageUpload}
                                disabled={uploadingImage}
                                className="px-5 py-2 md:py-2.5 text-[10px] md:text-xs font-black bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
                              >
                                {uploadingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                আপলোড করুন
                              </button>
                            )}
                          </div>
                          
                          {uploadError && (
                            <p className="text-[10px] md:text-xs text-rose-500 font-bold mt-2">{uploadError}</p>
                          )}
                       </div>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                       <div className="space-y-2">
                          <label className="text-xs md:text-sm font-black text-slate-700 ml-1">আপনার নাম</label>
                          <div className="relative group/input">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within/input:text-primary-600 transition-colors" />
                             </div>
                             <input 
                               type="text" 
                               value={displayName}
                               onChange={(e) => setDisplayName(e.target.value)}
                               className="w-full pl-11 md:pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary-600 focus:bg-white font-bold transition-all text-slate-900 text-sm md:text-base" 
                               placeholder="আপনার পুরো নাম লিখুন"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs md:text-sm font-black text-slate-700 ml-1">ফোন নাম্বার</label>
                          <div className="relative group/input">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <div className="text-slate-400 font-black text-[10px] md:text-xs group-focus-within/input:text-primary-600 transition-colors">BD</div>
                             </div>
                             <input 
                               type="tel" 
                               value={phone}
                               onChange={(e) => setPhone(e.target.value)}
                               className="w-full pl-11 md:pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary-600 focus:bg-white font-bold transition-all text-slate-900 text-sm md:text-base" 
                               placeholder="01XXXXXXXXX"
                             />
                          </div>
                       </div>
                       <div className="space-y-2 md:col-span-2">
                          <label className="text-xs md:text-sm font-black text-slate-700 ml-1">ইমেইল এড্রেস (পরিবর্তনযোগ্য নয়)</label>
                          <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                             </div>
                             <input type="email" disabled value={profile?.email || ''} className="w-full pl-11 md:pl-12 pr-4 py-3.5 md:py-4 bg-slate-100 border border-slate-200 rounded-xl md:rounded-2xl text-slate-400 font-bold cursor-not-allowed text-sm md:text-base" />
                          </div>
                       </div>
                       <div className="space-y-2 md:col-span-2">
                          <label className="text-xs md:text-sm font-black text-slate-700 ml-1">আপনার সম্পর্কে কিছু বলুন</label>
                          <textarea 
                             rows={4} 
                             value={bio}
                             onChange={(e) => setBio(e.target.value)}
                             className="w-full p-4 md:p-5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary-600 focus:bg-white font-bold transition-all placeholder:text-slate-400 resize-none text-slate-900 text-sm md:text-base" 
                             placeholder="আপনার শিক্ষার্থী হিসেবে যাত্রা বা আপনার সম্পর্কে লিখুন..."
                          ></textarea>
                       </div>
                    </div>

                    <div className="pt-4 md:pt-6 flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                       <button 
                         type="submit" 
                         disabled={loading}
                         className="w-full sm:w-auto inline-flex items-center justify-center px-8 md:px-10 py-3.5 md:py-4 bg-primary-600 text-white rounded-xl md:rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 text-sm md:text-base"
                       >
                          {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                          তথ্য আপডেট করুন
                       </button>

                       {success && (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="flex items-center text-emerald-500 font-black text-xs md:text-sm"
                         >
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                            সফলভাবে আপডেট হয়েছে!
                         </motion.div>
                       )}
                    </div>
                </motion.form>
              )}

              {activeTab === 'password' && (
                <motion.form 
                  key="password-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8 max-w-lg"
                >
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-sm font-black text-slate-700 ml-1">বর্তমান পাসওয়ার্ড</label>
                         <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                               <Lock className="w-5 h-5 text-slate-400 group-focus-within/input:text-primary-600 transition-colors" />
                            </div>
                            <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary-600 focus:bg-white font-bold transition-all" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-black text-slate-700 ml-1">নতুন পাসওয়ার্ড</label>
                         <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                               <Lock className="w-5 h-5 text-slate-400 group-focus-within/input:text-primary-600 transition-colors" />
                            </div>
                            <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary-600 focus:bg-white font-bold transition-all" />
                         </div>
                      </div>
                   </div>

                   <div className="pt-6">
                      <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                         পাসওয়ার্ড পরিবর্তন করুন
                      </button>
                   </div>
                </motion.form>
              )}

              {activeTab === 'notifications' && (
                <motion.div 
                  key="notification-settings"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6 max-w-2xl"
                >
                    <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-[2rem] transition-all hover:border-primary-100">
                       <div>
                          <h4 className="font-black text-slate-900 tracking-tight">ইমেইল নোটিফিকেশন</h4>
                          <p className="text-sm text-slate-500 mt-1 font-bold">নতুন কোর্স এবং অফার সম্পর্কে আপডেট পেতে চান?</p>
                       </div>
                       <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-14 h-8 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                       </div>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
