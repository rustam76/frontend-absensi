'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginApi } from '@/lib/api';
import { getToken, setToken, removeToken, setUser as storeUser, getUser as fetchStoredUser, isTokenValid } from '@/lib/auth';

interface User {
  employee_id: string;
  name: string;
  addres: string;
  departement: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
}

interface AuthContextProps {
  user: User | null;
  login: (employeeId: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with true untuk initial load
  const router = useRouter();

  useEffect(() => {
    // Check authentication pada initial load
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      // Validasi token terlebih dahulu
      if (!isTokenValid()) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Jika token valid, ambil user data
      const storedUser = fetchStoredUser();
      if (storedUser) {
        setUser(storedUser);
      } else {
        // Token ada tapi user data tidak ada, logout
        logout();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (employeeId: string) => {
    setLoading(true);
    try {
      const res = await loginApi(employeeId);
      const { token, user } = res;

      setToken(token);
      storeUser(user);
      setUser(user);

      // Redirect berdasarkan role
      if (user.departement.toLowerCase() === 'admin') {
        router.push('/admin');
      } else {
        router.push('/employee');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    storeUser(null);
    setUser(null);
    router.push('/auth');
  };

  const isAuthenticated = user !== null && isTokenValid();

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}