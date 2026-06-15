import React, { createContext, useContext, useState } from 'react';

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

interface Branch {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  currentShop: Shop | null;
  currentBranch: Branch | null;
  login: (token: string, username: string, avatarUrl?: string) => void;
  logout: () => void;
  selectShop: (shop: Shop) => void;
  selectBranch: (branch: Branch) => void;
  updateUserAvatar: (avatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('zoos_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [currentShop, setCurrentShop] = useState<Shop | null>(() => {
    const savedShop = localStorage.getItem('zoos_shop');
    return savedShop ? JSON.parse(savedShop) : null;
  });
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(() => {
    const savedBranch = localStorage.getItem('zoos_branch');
    return savedBranch ? JSON.parse(savedBranch) : null;
  });

  const login = (token: string, username: string, avatarUrl?: string) => {
    const newUser = { token, username, avatarUrl };
    setUser(newUser);
    localStorage.setItem('zoos_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setCurrentShop(null);
    setCurrentBranch(null);
    localStorage.removeItem('zoos_user');
    localStorage.removeItem('zoos_shop');
    localStorage.removeItem('zoos_branch');
  };

  const selectShop = (shop: Shop) => {
    setCurrentShop(shop);
    localStorage.setItem('zoos_shop', JSON.stringify(shop));
    // Clear branch when selecting a new shop
    setCurrentBranch(null);
    localStorage.removeItem('zoos_branch');
  };

  const selectBranch = (branch: Branch) => {
    setCurrentBranch(branch);
    localStorage.setItem('zoos_branch', JSON.stringify(branch));
  };

  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('zoos_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, currentShop, currentBranch, login, logout, selectShop, selectBranch, updateUserAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
