// lib/auth.ts
interface User {
  employee_id: string;
  name: string;
  addres: string;
  departement: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Token functions dengan cookie support
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Coba dari localStorage dulu
  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) return localToken;
  
  // Jika tidak ada di localStorage, coba dari cookie
  const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${TOKEN_KEY}=`))
    ?.split('=')[1];
    
  return cookieToken || null;
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  // Simpan di localStorage
  localStorage.setItem(TOKEN_KEY, token);
  
  // Simpan juga di cookie untuk middleware
  const maxAge = 60 * 60 * 24; // 24 jam
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; secure; samesite=strict`;
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  
  // Hapus dari localStorage
  localStorage.removeItem(TOKEN_KEY);
  
  // Hapus dari cookie
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

// User functions
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const setUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

// Utility function untuk validasi token
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Cek apakah token expired
    if (payload.exp && payload.exp < currentTime) {
      removeToken();
      setUser(null);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    removeToken();
    setUser(null);
    return false;
  }
};