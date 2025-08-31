// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
// Firebase Auth imports
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      toast.success("Account created successfully!");
    } catch (error: any) {
      let userMessage = "Failed to create account. Please try again.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            userMessage = "This email is already in use. Please log in instead.";
            break;
          case 'auth/invalid-email':
            userMessage = "Please enter a valid email address.";
            break;
          case 'auth/weak-password':
            userMessage = "Password is too weak. Use at least 6 characters.";
            break;
          case 'auth/operation-not-allowed':
            userMessage = "Email/Password sign-up is disabled. Please contact support.";
            break;
          default:
            userMessage = "An unexpected sign-up error occurred.";
            break;
        }
      } else {
        userMessage = "A network or unknown error occurred during sign-up.";
      }

      toast.error(userMessage);             // ✅ user-friendly message on red toast
console.error("Firebase Sign-up Error:", error.message || error.code);

      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      let userMessage = "Login failed. Please check your credentials.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            userMessage = "Please enter a valid email address.";
            break;
          case 'auth/user-disabled':
            userMessage = "This account has been disabled.";
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            userMessage = "Invalid email or password.";
            break;
          case 'auth/too-many-requests':
            userMessage = "Too many login attempts. Please try again later.";
            break;
          case 'auth/operation-not-allowed':
            userMessage = "An unexpected login error occurred. Please try again.";
            break;
        }
      } else {
        userMessage = "A network or unknown error occurred during login.";
      }

      toast.error(userMessage);             // ✅ user-friendly message on red toast
console.error("Firebase Login Error:", error.message || error.code);

      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error("Failed to log out."); // friendly message
      console.error("Logout failed:", error.message || error.code);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
