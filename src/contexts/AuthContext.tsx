
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MockUser, getCurrentUser, mockLogin, mockSignup, mockLogout } from '../lib/mockAuth';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: MockUser | null;
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
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from local storage on app load
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      const user = await mockSignup(email, password);
      setCurrentUser(user);
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const user = await mockLogin(email, password);
      setCurrentUser(user);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to login");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await mockLogout();
      setCurrentUser(null);
      toast.success("Logged out successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to logout");
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
