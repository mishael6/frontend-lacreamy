import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('lacreamy_admin_token');
      const adminData = localStorage.getItem('lacreamy_admin');
      if (token && adminData) {
        setAdmin(JSON.parse(adminData));
      }
    } catch {
      localStorage.removeItem('lacreamy_admin_token');
      localStorage.removeItem('lacreamy_admin');
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAdmin = useCallback((token, adminData) => {
    localStorage.setItem('lacreamy_admin_token', token);
    localStorage.setItem('lacreamy_admin', JSON.stringify(adminData));
    setAdmin(adminData);
  }, []);

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem('lacreamy_admin_token');
    localStorage.removeItem('lacreamy_admin');
    setAdmin(null);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: '3rem' }}>🥐</span>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);