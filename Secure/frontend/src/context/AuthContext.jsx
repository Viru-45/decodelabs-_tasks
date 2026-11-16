import { useState, useCallback } from "react";
import { AuthContext } from "./authContext.js";
import { fetchProfile, loginUser, registerUser } from "../services/authApi.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await loginUser({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    return registerUser({ name, email, password });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    try {
      const profile = await fetchProfile(token);
      setUser(profile);
      return profile;
    } catch (err) {
      if (err.status === 401) {
        logout();
      }
      throw err;
    }
  }, [token, logout]);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
