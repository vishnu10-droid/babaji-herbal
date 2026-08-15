import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./auth-context";

const USER_KEY = "auth_user";
const TOKEN_KEY = "auth_token";

const readUser = () => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [token, user]);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  }, []);

  const updateUser = useCallback((userData) => setUser((current) => ({ ...current, ...userData })), []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(token), login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
