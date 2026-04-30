import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, LayoutDashboard, GraduationCap, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';

export default function Navbar() {
  const { user, profile, signOut, isInstructor, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'একাডেমিক (SSC/HSC)', href: '/courses?category=academic' },
    { name: 'স্কিল ডেভেলপমেন্ট', href: '/courses?category=skills' },
    { name: 'ভর্তি প্রস্তুতি', href: '/courses?category=admission' },
    { name: 'ই-বুক', href: '/ebooks' },
    { name: 'শপ/পণ্য', href: '/products' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-50  border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-3 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-50 blur-md opacity-30 group-hover:opacity-60 transition-opacity rounded-xl"></div>
              <div className="bg-primary-600 p-2 rounded-xl relative z-10">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 tracking-tight hidden sm:block">
              Zunayed Academy
            </span>
          </Link>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 transition-all hover:scale-[1.02]">
            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-primary-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="pl-4">
                  <Search className="h-5 w-5 text-slate-500 group-hover:text-primary-600 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-3 pr-4 py-2.5 bg-transparent text-slate-900 placeholder-slate-500 focus:outline-none sm:text-sm"
                  placeholder="আপনার কাঙ্খিত কোর্সটি খুঁজুন..."
                />
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center space-x-6 shrink-0">
            {/* Categories Dropdown */}
            <HeadlessMenu as="div" className="relative inline-block text-left">
              <div>
                <HeadlessMenu.Button className="inline-flex justify-center items-center w-full text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus:outline-none group">
                  ক্যাটাগরি
                  <ChevronDown className="-mr-1 ml-1 h-4 w-4 group-hover:text-primary-600 transition-colors" aria-hidden="true" />
                </HeadlessMenu.Button>
              </div>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95 -translate-y-2"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100 translate-y-0"
                leaveTo="transform opacity-0 scale-95 -translate-y-2"
              >
                <HeadlessMenu.Items className="origin-top-right absolute right-0 mt-4 w-60 rounded-2xl shadow-sm bg-white  border border-slate-200 focus:outline-none py-2 overflow-hidden">
                  {categories.map((category) => (
                    <HeadlessMenu.Item key={category.name}>
                      {({ active }) => (
                        <Link
                          to={category.href}
                          className={`${
                            active ? 'bg-slate-50 text-primary-600 pl-6' : 'text-slate-600 pl-4'
                          } block pr-4 py-3 text-sm transition-all duration-200`}
                        >
                          {category.name}
                        </Link>
                      )}
                    </HeadlessMenu.Item>
                  ))}
                  <div className="border-t border-slate-200 my-2"></div>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        to="/courses"
                        className={`${
                          active ? 'bg-slate-50 text-primary-600 pl-6' : 'text-slate-600 pl-4'
                        } block pr-4 py-3 text-sm font-medium transition-all duration-200`}
                      >
                        সব কোর্স দেখুন
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                </HeadlessMenu.Items>
              </Transition>
            </HeadlessMenu>

            {user ? (
              <div className="flex items-center space-x-5 pl-6 border-l border-slate-200">
                <Link
                  to={isAdmin ? '/admin' : isInstructor ? '/instructor' : '/dashboard'}
                  className="p-2 text-slate-500 hover:text-primary-600 transition-colors hover:scale-110 transform duration-200"
                  title="ড্যাশবোর্ড"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
                <div className="h-9 w-9 rounded-full bg-primary-600 p-[2px] cursor-pointer hover:shadow-sm transition-all">
                  <div className="h-full w-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt={profile.displayName} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-slate-500 hover:text-red-400 transition-colors"
                >
                  লগআউট
                </button>
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
          <div className="md:hidden flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-primary-600">
               <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
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
