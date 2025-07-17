import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get stored credentials or use defaults
    const storedCredentials = localStorage.getItem('loginCredentials');
    const credentials = storedCredentials 
      ? JSON.parse(storedCredentials)
      : { email: 'admin@pondok.com', password: 'admin123' };

    if (email === credentials.email && password === credentials.password) {
      const userData: User = {
        id: '1',
        name: 'Administrator',
        email: credentials.email,
        role: 'admin',
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Get current stored credentials
    const storedCredentials = localStorage.getItem('loginCredentials');
    const credentials = storedCredentials 
      ? JSON.parse(storedCredentials)
      : { email: 'admin@pondok.com', password: 'admin123' };

    // Verify current password
    if (currentPassword !== credentials.password) {
      return false;
    }

    // Update password
    const newCredentials = {
      ...credentials,
      password: newPassword
    };

    localStorage.setItem('loginCredentials', JSON.stringify(newCredentials));
    
    // Update user data if needed
    if (user) {
      const updatedUser = { ...user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};