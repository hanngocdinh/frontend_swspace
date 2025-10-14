import React, { createContext, useState, useContext, useEffect } from 'react';

// Dữ liệu mẫu các user cho demo
const usersData = [
  {
    id: 1,
    username: 'hanne',
    password: 'password123',
    fullName: 'Hanne Nguyen',
    email: 'hanne@example.com',
    role: 'user'
  },
  {
    id: 2,
    username: 'john',
    password: 'password123',
    fullName: 'John Smith',
    email: 'john@example.com',
    role: 'user'
  }
];

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
  const login = (username, password) => {
    // Tìm user trong dữ liệu mẫu
    const user = usersData.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      // Lưu thông tin user vào state và localStorage (trừ password)
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, message: 'Invalid username or password' };
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
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
    isAuthenticated
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
