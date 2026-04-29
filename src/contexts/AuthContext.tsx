import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth as fbAuth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  register: (email: string, password: string, displayName: string) => Promise<any>;
  getDashboardPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getDashboardPath = () => {
    if (!profile) return '/login';
    switch (profile.role) {
      case UserRole.ADMIN: return '/admin';
      default: return '/dashboard';
    }
  };

  useEffect(() => {
    // Initial check for session
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setProfile(data.user);
          setUser({ uid: data.user.uid, email: data.user.email } as any);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      setProfile(data.user);
      setUser({ uid: data.user.uid, email: data.user.email } as any);
      return data.user;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(fbAuth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setUser({ uid: data.user.uid, email: data.user.email } as any);
        return data.user;
      } else {
        const errorData = await response.json();
        // Include detailed hints for technical/permission errors to aid debugging
        const message = errorData.hint 
          ? `${errorData.error} Hint: ${errorData.hint}` 
          : (errorData.error || 'Google login failed');
        throw new Error(message);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      throw err;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    return response.json();
  };

  const signOut = async () => {
    try {
      await fbAuth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const isAdmin = profile?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isAdmin, 
      isInstructor: isAdmin, 
      signOut, 
      login, 
      loginWithGoogle,
      register, 
      getDashboardPath 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
