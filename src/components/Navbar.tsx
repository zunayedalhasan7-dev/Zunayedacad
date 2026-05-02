import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Menu, X, LayoutDashboard, Search, ChevronDown, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import Logo from './Logo';

export default function Navbar() {
  const { user, profile, signOut, isInstructor, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'একাডেমিক (SSC/HSC)', href: '/courses?category=academic' },
    { name: 'স্কিল ডেভেলপমেন্ট', href: '/courses?category=skills' },
    { name: 'ভর্তি প্রস্তুতি', href: '/courses?category=admission' },
    { name: 'ইন্সট্রাক্টরগণ', href: '/instructors' },
    { name: 'ই-বুক', href: '/ebooks' },
    { name: 'শপ/পণ্য', href: '/products' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-50  border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Left: Logo */}
          <Link to="/" className="shrink-0 scale-75 md:scale-90 lg:scale-100 origin-left">
            <Logo />
          </Link>

          {/* Center: Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 transition-all hover:scale-[1.02]">
            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-primary-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="pl-4">
                  <Search className="h-5 w-5 text-slate-500 group-hover:text-primary-600 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-3 pr-4 py-2.5 bg-transparent text-slate-900 placeholder-slate-500 focus:outline-none sm:text-sm"
                  placeholder="আপনার কাঙ্খিত কোর্সটি খুঁজুন..."
                />
              </div>
            </div>
          </form>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center space-x-6 shrink-0">
            {/* Phone Number */}
            <a 
              href="tel:01626538051" 
              className="flex items-center gap-2 text-sm font-black text-slate-700 bg-slate-100 hover:bg-primary-50 hover:text-primary-600 px-4 py-2 rounded-full transition-all active:scale-95 group"
            >
              <Phone className="w-4 h-4 text-primary-600 group-hover:animate-bounce" />
              <span>01626538051</span>
            </a>

            {/* Categories Dropdown (Hover based) */}
            <div className="relative group h-full flex items-center">
              <button className="inline-flex justify-center items-center h-full text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors focus:outline-none py-2">
                ক্যাটাগরি
                <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-64 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      className="block px-6 py-3.5 text-sm font-bold text-slate-600 hover:text-primary-600 hover:bg-slate-50 transition-all border-l-4 border-transparent hover:border-primary-600 pl-5 hover:pl-7"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 my-2 mx-4"></div>
                  <Link
                    to="/courses"
                    className="block px-6 py-3.5 text-sm font-black text-primary-600 hover:bg-primary-50 transition-all border-l-4 border-transparent hover:border-primary-600 pl-5 hover:pl-7"
                  >
                    সব কোর্স দেখুন
                  </Link>
                </div>
              </div>
            </div>

            {user ? (
              <div className="flex items-center space-x-5 pl-6 border-l border-slate-200">
                <Link
                  to={isAdmin ? '/admin' : isInstructor ? '/instructor' : '/dashboard'}
                  className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  ড্যাশবোর্ড
                </Link>
                
                {/* Profile Dropdown */}
                <HeadlessMenu as="div" className="relative">
                  <HeadlessMenu.Button className="flex items-center focus:outline-none">
                    <div className="h-9 w-9 rounded-full bg-primary-600 p-[2px] cursor-pointer hover:shadow-md transition-all active:scale-95">
                      <div className="h-full w-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                        {profile?.photoURL ? (
                          <img src={profile.photoURL} alt={profile.displayName} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-slate-600" />
                        )}
                      </div>
                    </div>
                  </HeadlessMenu.Button>

                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 focus:outline-none divide-y divide-slate-50 overflow-hidden z-50">
                      <div className="px-6 py-4 bg-slate-50/50">
                        <p className="text-sm font-black text-slate-900 truncate tracking-tight">{profile?.displayName || 'ব্যবহারকারী'}</p>
                        <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={`${
                                active ? 'bg-primary-50 text-primary-600 pl-7' : 'text-slate-600 pl-5'
                              } group flex w-full items-center px-6 py-3 text-sm font-bold transition-all border-l-4 border-transparent ${active ? 'border-primary-600' : ''}`}
                            >
                              আমার কোর্সসমূহ
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              to="/settings"
                              className={`${
                                active ? 'bg-primary-50 text-primary-600 pl-7' : 'text-slate-600 pl-5'
                              } group flex w-full items-center px-6 py-3 text-sm font-bold transition-all border-l-4 border-transparent ${active ? 'border-primary-600' : ''}`}
                            >
                              প্রোফাইল সেটিংস
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                      </div>
                      <div className="py-2">
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut()}
                              className={`${
                                active ? 'bg-red-50 text-red-500 pl-7' : 'text-slate-600 pl-5'
                              } group flex w-full items-center px-6 py-3 text-sm font-bold transition-all border-l-4 border-transparent ${active ? 'border-red-500' : ''}`}
                            >
                              লগআউট
                            </button>
                          )}
                        </HeadlessMenu.Item>
                      </div>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4 pl-6 border-l border-slate-200">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  লগইন
                </Link>
                <Link
                  to="/register"
                  className="relative group overflow-hidden rounded-xl bg-white border border-slate-200 px-6 py-2.5"
                >
                  <div className="absolute inset-0 w-full h-full bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-sm font-semibold text-primary-600 group-hover:text-white transition-colors">
                    রেজিস্ট্রেশন
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 sm:p-2.5 outline-none rounded-xl hover:bg-slate-100 transition-all active:scale-95"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-50  border-b border-slate-200 overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Phone Number */}
              <a 
                href="tel:01626538051" 
                className="flex items-center justify-center gap-3 w-full py-4 bg-primary-50 text-primary-600 rounded-xl font-black text-lg mb-4 border border-primary-100"
              >
                <Phone className="w-5 h-5" />
                <span>কল করুন: 01626538051</span>
              </a>

              {/* Mobile Search */}
              <form onSubmit={(e) => { handleSearch(e); setIsOpen(false); }} className="relative group mx-2 mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="কোর্স খুঁজুন..."
                  className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                />
              </form>

              <div className="space-y-1">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 shadow-text">ক্যাটাগরি</p>
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    to={category.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  to="/courses"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-primary-600 hover:bg-slate-50 transition-colors mt-2"
                >
                  সব কোর্স দেখুন
                </Link>
              </div>
              
              <div className="pt-6 mt-6 border-t border-slate-200 flex flex-col space-y-3">
                {user ? (
                  <>
                    <Link
                      to={isAdmin ? '/admin' : isInstructor ? '/instructor' : '/dashboard'}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 transition-colors"
                    >
                      ড্যাশবোর্ড
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 transition-colors"
                    >
                      প্রোফাইল সেটিংস
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="text-left flex px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      লগআউট
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4 px-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-center items-center px-4 py-3 border border-slate-200 hover:border-primary-100 rounded-xl text-base font-medium text-slate-900 bg-slate-50 transition-all"
                    >
                      লগইন
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-center items-center px-4 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-primary-600 hover:shadow-sm transition-all"
                    >
                      রেজিস্ট্রেশন
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
