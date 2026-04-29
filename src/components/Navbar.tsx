import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, LogOut, Menu, X, LayoutDashboard, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, profile, signOut, isInstructor, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'হোম', href: '/' },
    { name: 'কোর্সসমূহ', href: '/courses' },
    { name: 'ফ্রি কোর্স', href: '/free-courses' },
    { name: 'যোগাযোগ', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-900 tracking-tight">
              Zunayed Academy
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === link.href ? 'text-primary-600' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={isAdmin ? '/admin' : isInstructor ? '/instructor' : '/dashboard'}
                  className="p-2 text-slate-600 hover:text-primary-600 transition-colors"
                  title="ড্যাশবোর্ড"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
                <div className="h-8 w-8 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center overflow-hidden">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt={profile.displayName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-primary-600" />
                  )}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                >
                  লগইন
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                >
                  রেজিস্ট্রেশন
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary-600 p-2"
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
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                {user ? (
                  <>
                    <Link
                      to={isAdmin ? '/admin' : isInstructor ? '/instructor' : '/dashboard'}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary-600"
                    >
                      ড্যাশবোর্ড
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="text-left block px-3 py-2 rounded-md text-base font-medium text-red-600"
                    >
                      লগআউট
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-slate-600"
                    >
                      লগইন
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white text-center"
                    >
                      রেজিস্ট্রেশন
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
