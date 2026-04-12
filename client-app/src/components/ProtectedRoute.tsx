import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ requireShop?: boolean }> = ({ requireShop = true }) => {
  const { user, currentShop } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireShop && !currentShop) {
    return <Navigate to="/shops" replace />;
  }

  return <Outlet />;
};
