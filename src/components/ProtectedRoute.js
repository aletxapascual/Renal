import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// role: 'admin' o 'cliente' (opcional)
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    // No autenticado
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // No tiene el rol requerido
    return <Navigate to="/login" replace />;
  }

  return children;
} 