import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CheckSquare, 
  DollarSign, 
  Settings, 
  PlayCircle,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export default function DashboardSidebar() {
  const { profile } = useAuth();
  const role = profile?.role;

  const adminLinks: SidebarItem[] = [
    { name: 'ওভারভিউ', href: '/admin', icon: LayoutDashboard },
    { name: 'ইউজার ম্যানেজমেন্ট', href: '/admin/users', icon: Users },
    { name: 'কোর্স ম্যানেজমেন্ট', href: '/admin/courses', icon: CheckSquare },
    { name: 'পেমেন্ট হিস্ট্রি', href: '/admin/payments', icon: DollarSign },
  ];

  const studentLinks: SidebarItem[] = [
    { name: 'আমার কোর্স', href: '/dashboard', icon: PlayCircle },
    { name: 'ব্রাউজ কোর্স', href: '/courses', icon: BookOpen },
    { name: 'প্রোফাইল', href: '/profile', icon: Settings },
  ];

  let links: SidebarItem[] = [];
  if (role === UserRole.ADMIN) links = adminLinks;
  else links = studentLinks;

  return (
    <aside className="w-full lg:w-64 bg-white  border-r border-slate-200 lg:min-h-[calc(100vh-64px)] flex flex-col p-4 lg:p-6 space-y-8 sticky top-16 self-start z-20">
      <div className="hidden lg:block relative">
        <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-4">মেনু</div>
        <div className="absolute top-0 left-0 w-8 h-8 bg-primary-50 blur-xl rounded-full"></div>
      </div>
      <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-3 pb-2 lg:pb-0 hide-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={link.href === '/admin' || link.href === '/instructor' || link.href === '/dashboard'}
            className={({ isActive }) => 
              `flex items-center space-x-3 w-full p-3 rounded-xl font-bold transition-all duration-300 shrink-0 lg:shrink group relative overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-r from-primary-600/20 to-indigo-600/20 text-slate-900 border border-slate-200 shadow-sm' 
                  : 'text-slate-500 hover:text-primary-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-50 rounded-r-full shadow-sm"></div>}
                <link.icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'group-hover:text-primary-600 transition-colors'}`} />
                <span className="text-sm lg:text-base whitespace-nowrap">{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="hidden lg:block pt-8 border-t border-slate-200">
        <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-4">সহযোগিতা</div>
        <div className="bg-slate-50  p-4 rounded-2xl border border-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary-50 rounded-full blur-xl group-hover:bg-primary-50 transition-colors"></div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed relative z-10">
            কোন সমস্যা হলে আমাদের সাপোর্ট টিমে নক করুন।
          </p>
          <button className="mt-4 text-xs font-bold text-primary-600 hover:text-slate-900 transition-colors relative z-10 flex items-center justify-center w-full py-2 bg-primary-50 rounded-lg border border-primary-100 hover:border-primary-100 hover:bg-primary-50">
            যোগাযোগ করুন
          </button>
        </div>
      </div>
    </aside>
  );
}
