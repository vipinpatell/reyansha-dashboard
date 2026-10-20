'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from '@/lib/api/auth';
import { ApiError, getApiErrorMessage } from '@/lib/api/client';
import type { AuthUser } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string;
  passwordChanged: boolean;
  signIn: (identifier: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<AuthUser>;
  clearAuth: (passwordChanged?: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError('');
      return currentUser;
    } catch (requestError) {
      if (!(requestError instanceof ApiError && requestError.status === 401)) {
        setError(getApiErrorMessage(requestError));
      }
      throw requestError;
    }
  }, []);

  const clearAuth = useCallback((changedPassword = false) => {
    setUser(null);
    setError('');
    setLoading(false);
    setPasswordChanged(changedPassword);
  }, []);

  useEffect(() => {
    let active = true;
    const handleUnauthorized = () => {
      if (active) clearAuth();
    };

    window.addEventListener('reyansha:unauthorized', handleUnauthorized);
    getCurrentUser()
      .then((currentUser) => {
        if (active) {
          setUser(currentUser);
          setError('');
        }
      })
      .catch((requestError: unknown) => {
        if (active && !(requestError instanceof ApiError && requestError.status === 401)) {
          setError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      window.removeEventListener('reyansha:unauthorized', handleUnauthorized);
    };
  }, [clearAuth]);

  const signIn = useCallback(
    async (identifier: string, password: string) => {
      setLoading(true);
      setError('');
      setPasswordChanged(false);
      try {
        await loginRequest({ identifier, password });
        return await refreshUser();
      } catch (requestError) {
        setUser(null);
        throw requestError;
      } finally {
        setLoading(false);
      }
    },
    [refreshUser],
  );

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        passwordChanged,
        signIn,
        signOut,
        refreshUser,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
