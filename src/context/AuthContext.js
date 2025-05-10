import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Estado simulado: null = no logueado, objeto = usuario logueado
  const [user, setUser] = useState(null);

  // Simular login: recibe nombre y rol ('admin' o 'cliente')
  const login = (username, role) => {
    setUser({ username, role });
  };

  // Simular logout
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 