import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nipun_token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('nipun_role') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            setUser(res.data.user);
            setRole(res.data.user.role || (res.data.user.uid ? 'Student' : 'Teacher'));
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session expired or error fetching profile:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  const loginTeacher = async (identifier, password) => {
    const res = await axios.post('/api/auth/teacher/login', { identifier, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('nipun_token', receivedToken);
      localStorage.setItem('nipun_role', 'Teacher');
      setToken(receivedToken);
      setUser(receivedUser);
      setRole('Teacher');
      return receivedUser;
    }
  };

  const loginStudent = async (uid) => {
    const res = await axios.post('/api/auth/student/login', { uid });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('nipun_token', receivedToken);
      localStorage.setItem('nipun_role', 'Student');
      setToken(receivedToken);
      setUser(receivedUser);
      setRole('Student');
      return receivedUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('nipun_token');
    localStorage.removeItem('nipun_role');
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, loginTeacher, loginStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
