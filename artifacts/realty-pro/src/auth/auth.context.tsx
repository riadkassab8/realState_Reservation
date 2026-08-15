import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, AuthState } from "./auth.types";
import { mockLogin, mockLogout } from "./auth.mock";
import { saveAuthSession, getAuthSession, clearAuthSession } from "./auth.storage";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = getAuthSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedInUser = await mockLogin(email, password);
      setUser(loggedInUser);
      saveAuthSession(loggedInUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await mockLogout();
      setUser(null);
      clearAuthSession();
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
