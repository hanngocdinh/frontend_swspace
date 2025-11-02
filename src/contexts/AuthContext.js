import React, { createContext, useState, useContext, useEffect } from 'react';

// Backend API base URL
const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api`;

// Tạo context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State để lưu thông tin người dùng đăng nhập
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra xem có thông tin đăng nhập trong localStorage không khi load trang
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Hàm đăng nhập
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Lưu thông tin user và token vào state và localStorage
        const userWithToken = { ...data.user, token: data.token };
        setCurrentUser(userWithToken);
        localStorage.setItem('user', JSON.stringify(userWithToken));
        localStorage.setItem('token', data.token);
        return { success: true, user: userWithToken };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please check if backend is running.' };
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  // Hàm đăng ký
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        const userWithToken = { ...data.user, token: data.token };
        setCurrentUser(userWithToken);
        localStorage.setItem('user', JSON.stringify(userWithToken));
        localStorage.setItem('token', data.token);
        return { success: true, user: userWithToken };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please check if backend is running.' };
    }
  };

  // Hàm kiểm tra trạng thái đăng nhập
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Giá trị cung cấp cho context
  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
