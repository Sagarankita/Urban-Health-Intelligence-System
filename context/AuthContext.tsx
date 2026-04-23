import React, { createContext, useContext, useState } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "PATIENT" | "HOSPITAL" | "MUNICIPAL";
  phone?: string;
  ward?: string;
  insurance?: string;
  abha?: string;
  insurance_id?: string;
  allergies?: string;
  medical_history?: string;
  age?: string;
  gender?: string;
  hospital_id?: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (userData: AuthUser) => setUser(userData);
  const logout = () => setUser(null);
  const updateUser = (updates: Partial<AuthUser>) =>
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
