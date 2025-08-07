import React, { createContext, useContext, useState } from 'react';
import { type User } from 'firebase/auth';
import { useAuth } from '../features/auth/hooks/useAuth';

interface AuthContextType {
  user: User | null;
  login: ({ email, password }: { email: string; password: string }) => Promise<void>;
  register: ({ email, password }: { email: string; password: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  return <AuthContext.Provider value={{ ...auth }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
