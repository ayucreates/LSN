import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import { api } from '../services/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  showLoginModal: boolean;
  loginModalTitle: string;
  loginModalSubtitle: string;
  openLoginModal: (title?: string, subtitle?: string) => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  googleLogin: () => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_TITLE = 'Welcome back';
const DEFAULT_SUBTITLE = 'Sign in to your account';

function decodeToken(token: string): { userId: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalTitle, setLoginModalTitle] = useState(DEFAULT_TITLE);
  const [loginModalSubtitle, setLoginModalSubtitle] = useState(DEFAULT_SUBTITLE);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const stored = localStorage.getItem('auth_user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        }
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  const openLoginModal = useCallback((title?: string, subtitle?: string) => {
    setLoginModalTitle(title || DEFAULT_TITLE);
    setLoginModalSubtitle(subtitle || DEFAULT_SUBTITLE);
    setShowLoginModal(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
    setLoginModalTitle(DEFAULT_TITLE);
    setLoginModalSubtitle(DEFAULT_SUBTITLE);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res.success) {
      setUser(res.data);
      localStorage.setItem('auth_user', JSON.stringify(res.data));
      setShowLoginModal(false);
      return null;
    }
    return res.error;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.register(name, email, password);
    if (res.success) {
      setUser(res.data);
      localStorage.setItem('auth_user', JSON.stringify(res.data));
      setShowLoginModal(false);
      return null;
    }
    return res.error;
  }, []);

  const googleLogin = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    const mockUser: User = { id: `u-google-${Date.now()}`, name: 'Google User', email: 'google.user@gmail.com', role: 'customer' };
    setUser(mockUser);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    localStorage.setItem('auth_token', 'mock-google-jwt-token');
    setShowLoginModal(false);
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    api.logout();
    localStorage.removeItem('auth_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        showLoginModal,
        loginModalTitle,
        loginModalSubtitle,
        openLoginModal,
        closeLoginModal,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
