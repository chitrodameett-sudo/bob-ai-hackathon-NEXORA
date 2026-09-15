import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'usr-1',
    name: 'Cmdr. Ellen Vance',
    email: 'commander@nexora.mil',
    role: 'COMMANDER',
    department: 'Fleet Readiness Command'
  });
  const [token, setToken] = useState(localStorage.getItem('nexora_token') || 'demo_token');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    const res = await api.login({ email, password });
    setLoading(false);

    if (res && res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('nexora_token', res.token);
      return { success: true };
    } else {
      const demoUser = {
        id: 'usr-1',
        name: email.includes('manager') ? 'Marcus Vance' : 'Cmdr. Ellen Vance',
        email,
        role: email.includes('manager') ? 'LOGISTICS LEAD' : 'COMMANDER',
        department: 'Fleet Readiness Command'
      };
      setUser(demoUser);
      setToken('demo_token');
      localStorage.setItem('nexora_token', 'demo_token');
      return { success: true, message: 'Logged in (Demo Mode)' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexora_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
