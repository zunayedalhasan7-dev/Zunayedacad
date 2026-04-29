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
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 lg:min-h-[calc(100vh-64px)] flex flex-col p-4 lg:p-6 space-y-8 sticky top-16 self-start">
      <div className="hidden lg:block">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">মেনু</div>
      </div>
      <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-2 pb-2 lg:pb-0 scrollbar-hide">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={link.href === '/admin' || link.href === '/instructor' || link.href === '/dashboard'}
            className={({ isActive }) => 
              `flex items-center space-x-3 w-full p-3 rounded-xl font-bold transition-all shrink-0 lg:shrink ${
                isActive 
                  ? 'bg-primary-50 text-primary-600 shadow-sm shadow-primary-100/50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            <span className="text-sm lg:text-base whitespace-nowrap">{link.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="hidden lg:block pt-8 border-t border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">সহযোগিতা</div>
        <div className="bg-slate-50 p-4 rounded-2xl">
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            কোন সমস্যা হলে আমাদের সাপোর্ট টিমে নক করুন।
          </p>
          <button className="mt-3 text-xs font-bold text-primary-600 hover:text-primary-700">
            যোগাযোগ করুন
          </button>
        </div>
      </div>
    </aside>
  );
}
