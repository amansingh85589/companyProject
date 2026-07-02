import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [orgId, setOrgId] = useState(localStorage.getItem('adminOrgId') || null);

  const login = (newToken, newOrgId) => {
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminOrgId', newOrgId);
    setToken(newToken);
    setOrgId(newOrgId);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminOrgId');
    setToken(null);
    setOrgId(null);
  };

  return (
    <AuthContext.Provider value={{ token, orgId, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — components call useAuth() instead of useContext(AuthContext) directly
export function useAuth() {
  return useContext(AuthContext);
}
