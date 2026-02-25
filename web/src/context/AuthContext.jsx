import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // HARDCODED LOGIN - accepts any username/password for demo
  const login = async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if username and password are both "learnagram"
        if (credentials.username === 'learnagram' && credentials.password === 'learnagram') {
          const user = {
            id: '1',
            username: 'learnagram',
            name: 'Learnagram User',
            email: 'user@learnagram.com',
            role: 'user',
            department: 'Computer Science',
            year: 3,
            bio: 'Learning is fun!',
            profilePic: '/default-avatar.png'
          };
          
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', 'demo-token-123');
          
          setUser(user);
          setError(null);
          resolve({ data: { user, token: 'demo-token-123' } });
        } else {
          reject({ 
            response: { 
              data: { message: 'Invalid credentials. Try username: learnagram, password: learnagram' } 
            } 
          });
        }
      }, 500);
    });
  };

  // Simple register that creates a user with any credentials
  const register = async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now().toString(),
          username: userData.username || 'learnagram',
          name: userData.name || 'New User',
          email: userData.email || 'user@learnagram.com',
          role: userData.role || 'user',
          department: userData.department || 'Computer Science',
          year: userData.year || 1,
          bio: userData.bio || 'New to Learnagram',
          profilePic: '/default-avatar.png'
        };
        
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', 'demo-token-123');
        
        setUser(newUser);
        setError(null);
        resolve({ data: { user: newUser, token: 'demo-token-123' } });
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};