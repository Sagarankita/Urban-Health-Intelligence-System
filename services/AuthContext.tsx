import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "./api";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  age?: string;
  gender?: string;
  ward?: string;
  insurance?: string;
  abha?: string;
  insurance_id?: string;
  allergies?: string;
  medical_history?: string;
  hospital_id?: number;
  license_number?: string;
  address?: string;
  employee_id?: string;
  department?: string;
  assigned_ward?: string;
  is_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  updateUser: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load stored session on mount
  useEffect(() => {
    loadStoredSession();
  }, []);

  // Set auth header whenever token changes
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const loadStoredSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("auth_token");
      const storedUser = await AsyncStorage.getItem("auth_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        // Optionally refresh user data from server
        try {
          const res = await API.get("/api/auth/me");
          setUser(res.data);
          await AsyncStorage.setItem("auth_user", JSON.stringify(res.data));
        } catch {
          // Token expired or server down — keep cached data
        }
      }
    } catch (e) {
      console.error("Failed to load session:", e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: string) => {
    try {
      const res = await API.post("/api/auth/login", { email, password, role: role.toLowerCase() });
      const { user: userData, token: authToken } = res.data;
      setUser(userData);
      setToken(authToken);
      await AsyncStorage.setItem("auth_token", authToken);
      await AsyncStorage.setItem("auth_user", JSON.stringify(userData));
      return { success: true };
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || "Login failed";
      return { success: false, error: msg };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await API.post("/api/auth/register", data);
      const { user: userData, token: authToken } = res.data;
      setUser(userData);
      setToken(authToken);
      await AsyncStorage.setItem("auth_token", authToken);
      await AsyncStorage.setItem("auth_user", JSON.stringify(userData));
      return { success: true };
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || "Registration failed";
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    delete API.defaults.headers.common["Authorization"];
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("auth_user");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      AsyncStorage.setItem("auth_user", JSON.stringify(updated));
    }
  };

  const refreshUser = async () => {
    try {
      const res = await API.get("/api/auth/me");
      setUser(res.data);
      await AsyncStorage.setItem("auth_user", JSON.stringify(res.data));
    } catch (e) {
      console.error("Failed to refresh user:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
