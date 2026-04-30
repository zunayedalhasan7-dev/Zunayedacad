import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Camera, Save } from 'lucide-react';

export default function Settings() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account preferences and settings.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
            {[
              { id: 'profile', label: 'Profile Information' },
              { id: 'password', label: 'Security & Password' },
              { id: 'notifications', label: 'Notifications' },
            ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`px-6 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                   activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                 }`}
               >
                 {tab.label}
               </button>
            ))}
         </div>

         <div className="p-6 md:p-8">
            {activeTab === 'profile' && (
               <form className="space-y-8 max-w-2xl">
                  {/* Avatar upload */}
                  <div className="flex items-center space-x-6">
                     <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                           {profile?.photoURL ? (
                               <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                           ) : (
                               <User className="w-10 h-10 text-slate-500" />
                           )}
                        </div>
                        <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-primary-700 transition-colors">
                           <Camera className="w-4 h-4" />
                        </button>
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Profile Photo</h3>
                        <p className="text-xs text-slate-500 mb-3">Min 400x400px, PNG or JPEG</p>
                        <button type="button" className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                           Remove Photo
                        </button>
                     </div>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="w-5 h-5 text-slate-500" />
                           </div>
                           <input type="text" defaultValue={profile?.displayName || ''} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-colors" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Email Address (Read-only)</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="w-5 h-5 text-slate-500" />
                           </div>
                           <input type="email" disabled defaultValue={profile?.email || ''} className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
                        </div>
                     </div>
                     <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Bio</label>
                        <textarea rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-colors placeholder:text-slate-500" placeholder="Tell us a little bit about yourself..."></textarea>
                     </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                     <button type="button" className="inline-flex items-center px-6 py-2.5 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-sm">
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                     </button>
                  </div>
               </form>
            )}

            {activeTab === 'password' && (
               <form className="space-y-6 max-w-lg">
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Current Password</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="w-5 h-5 text-slate-500" />
                           </div>
                           <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-colors" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">New Password</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="w-5 h-5 text-slate-500" />
                           </div>
                           <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-colors" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="w-5 h-5 text-slate-500" />
                           </div>
                           <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-colors" />
                        </div>
                     </div>
                  </div>

                  <div className="pt-4 flex justify-start">
                     <button type="button" className="inline-flex items-center px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-sm">
                        Update Password
                     </button>
                  </div>
               </form>
            )}

            {activeTab === 'notifications' && (
               <div className="space-y-6 max-w-2xl">
                   <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div>
                         <h4 className="font-bold text-slate-900">Email Notifications</h4>
                         <p className="text-sm text-slate-500 mt-1">Receive updates about new courses and promotions.</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" defaultChecked />
                         <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div>
                         <h4 className="font-bold text-slate-900">Course Progress Alerts</h4>
                         <p className="text-sm text-slate-500 mt-1">Get notified to stay on track with your learning.</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" defaultChecked />
                         <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </div>
                   </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
