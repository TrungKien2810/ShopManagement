import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  token: string;
  avatarUrl?: string;
}

interface Shop {
  id: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  currentShop: Shop | null;
  login: (token: string, username: string, avatarUrl?: string) => void;
  logout: () => void;
  selectShop: (shop: Shop) => void;
  updateUserAvatar: (avatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('zoos_user');
    const savedShop = localStorage.getItem('zoos_shop');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedShop) setCurrentShop(JSON.parse(savedShop));
  }, []);

  const login = (token: string, username: string, avatarUrl?: string) => {
    const newUser = { token, username, avatarUrl };
    setUser(newUser);
    localStorage.setItem('zoos_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setCurrentShop(null);
    localStorage.removeItem('zoos_user');
    localStorage.removeItem('zoos_shop');
  };

  const selectShop = (shop: Shop) => {
    setCurrentShop(shop);
    localStorage.setItem('zoos_shop', JSON.stringify(shop));
  };

  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('zoos_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, currentShop, login, logout, selectShop, updateUserAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
