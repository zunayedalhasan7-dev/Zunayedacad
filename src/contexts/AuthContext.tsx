import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth as fbAuth, googleProvider, db as clientDb } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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
    const unsubscribe = fbAuth.onAuthStateChanged(async (fbUser) => {
      try {
        if (fbUser) {
          const userDoc = await getDoc(doc(clientDb, 'users', fbUser.uid));
          
          if (userDoc.exists()) {
            let userData = userDoc.data() as UserProfile;
            
            // Auto-promote admin email if not already admin
            if (fbUser.email === 'xpeee01@gmail.com' && userData.role !== UserRole.ADMIN) {
              await setDoc(doc(clientDb, 'users', fbUser.uid), { role: UserRole.ADMIN }, { merge: true });
              userData.role = UserRole.ADMIN;
            }
            
            setProfile(userData);
            setUser({ ...fbUser, ...userData });
          } else {
            // New user from maybe a background auth state
            const role = fbUser.email === 'xpeee01@gmail.com' ? UserRole.ADMIN : 'student';
            const newProfile: any = {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || '',
              photoURL: fbUser.photoURL || '',
              role: role,
              createdAt: serverTimestamp()
            };
            await setDoc(doc(clientDb, 'users', fbUser.uid), newProfile);
            setProfile(newProfile);
            setUser({ ...fbUser, ...newProfile });
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Auth state error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(fbAuth, email, password);
      const userDoc = await getDoc(doc(clientDb, 'users', result.user.uid));
      
      let data: any;
      if (userDoc.exists()) {
        data = userDoc.data();
        // Auto-promote
        if (email === 'xpeee01@gmail.com' && data.role !== UserRole.ADMIN) {
          await setDoc(doc(clientDb, 'users', result.user.uid), { role: UserRole.ADMIN }, { merge: true });
          data.role = UserRole.ADMIN;
        }
      } else {
        // Fallback for missing doc
        const role = email === 'xpeee01@gmail.com' ? UserRole.ADMIN : UserRole.STUDENT;
        data = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || '',
          role: role,
          createdAt: serverTimestamp()
        };
        await setDoc(doc(clientDb, 'users', result.user.uid), data);
      }
      
      setProfile(data as UserProfile);
      setUser({ ...result.user, ...data });
      return { ...result.user, ...data };
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
         throw new Error('Email/Password login is not enabled in your Firebase account. Please enable it in the Firebase Console under Authentication > Sign-in method.');
      }
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(fbAuth, googleProvider);
      const fbUser = result.user;
      
      const userDocRef = doc(clientDb, 'users', fbUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      let profileData: any;
      if (!userDoc.exists()) {
        const role = fbUser.email === 'xpeee01@gmail.com' ? UserRole.ADMIN : UserRole.STUDENT;
        profileData = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || '',
          photoURL: fbUser.photoURL || '',
          role: role,
          createdAt: serverTimestamp()
        };
        await setDoc(userDocRef, profileData);
      } else {
        profileData = userDoc.data();
        
        // Auto-promote
        if (fbUser.email === 'xpeee01@gmail.com' && profileData.role !== UserRole.ADMIN) {
          await setDoc(userDocRef, { role: UserRole.ADMIN }, { merge: true });
          profileData.role = UserRole.ADMIN;
        }

        // Update photo and name if missing
        await setDoc(userDocRef, {
          displayName: fbUser.displayName || profileData.displayName,
          photoURL: fbUser.photoURL || profileData.photoURL,
          updatedAt: serverTimestamp()
        }, { merge: true });
        profileData.displayName = fbUser.displayName || profileData.displayName;
        profileData.photoURL = fbUser.photoURL || profileData.photoURL;
      }

      setProfile(profileData as UserProfile);
      setUser({ ...fbUser, ...profileData });
      return { ...fbUser, ...profileData };
    } catch (err: any) {
      console.error('Google login error:', err);
      throw err;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(fbAuth, email, password);
      const fbUser = result.user;
      
      await updateProfile(fbUser, { displayName });
      
      const role = email === 'xpeee01@gmail.com' ? UserRole.ADMIN : UserRole.STUDENT;
      const profileData: any = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName,
        role: role,
        createdAt: serverTimestamp()
      };
      
      await setDoc(doc(clientDb, 'users', fbUser.uid), profileData);
      
      setProfile(profileData as UserProfile);
      setUser({ ...fbUser, ...profileData });
      return { ...fbUser, ...profileData };
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
         throw new Error('Email/Password registration is not enabled in your Firebase account. Please enable it in the Firebase Console under Authentication > Sign-in method.');
      }
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await fbAuth.signOut();
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

